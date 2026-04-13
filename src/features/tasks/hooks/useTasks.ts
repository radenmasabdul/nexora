import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { setAlert } from "@/app/state/alertSlice";
import {
    fetchAllTasks,
    fetchTaskById,
    createTask,
    updateTask,
    deleteTask,
    clearSelectedTask,
    type Task
} from "../store/tasksSlice";
import { fetchAllProjects } from "@/features/projects/store/projectsSlice";
import { fetchAllUsers } from "@/features/users/store/usersSlice";
import { taskSchema, taskUpdateSchema } from "../schemas/task.schema";
import type { AppDispatch, RootState } from "@/store";
import type { TaskSchema, TaskUpdateSchema } from "../schemas/task.schema";
import { format } from "date-fns";

type StatusTask = "to_do" | "in_progress" | "review" | "done";
type PriorityTask = "low" | "medium" | "high";

interface NewTask {
    project_id: string;
    assign_to: string;
    title: string;
    description: string;
    priority: PriorityTask | "";
    status: StatusTask | "";
    due_date: string;
};

export const useTasks = () => {
    const dispatch = useDispatch<AppDispatch>();
    const hasInitialized = useRef(false);

    const [search, setSearch] = useState<string>("");
    const [status, setStatus] = useState<string>("");
    const [priority, setPriority] = useState<string>("");

    const [searchProject, setSearchProject] = useState<string>("");
    const [searchUser, setSearchUser] = useState<string>("");
    const [taskTitle, setTaskTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [selectedPriority, setSelectedPriority] = useState<PriorityTask | "">("");
    const [selectedStatus, setSelectedStatus] = useState<StatusTask | "">("");
    const [dueDate, setDueDate] = useState<Date | undefined>(undefined);

    const [openModal, setOpenModal] = useState<boolean>(false);
    const [openConfirm, setOpenConfirm] = useState<boolean>(false);
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const {
        taskList,
        selectedTask,
        currentPage,
        totalData,
        totalPages,
        loadingFetch,
        loadingDetail,
        loadingMutation,
        errorFetch,
        errorMutation
    } = useSelector((state: RootState) => state.tasks);

    const { userList } = useSelector((state: RootState) => state.users);
    const { projectList } = useSelector((state: RootState) => state.projects);

    useEffect(() => {
        if(!hasInitialized.current) {
            dispatch(fetchAllTasks({ page: 1, limit: 10, search: "", status: "", priority: "" }));
            hasInitialized.current = true;
        }
    }, [dispatch]);

    useEffect(() => {
        if(!hasInitialized.current) return;

        const timer = setTimeout(() => {
            dispatch(fetchAllTasks({ page: 1, limit: 10, search, status, priority }));
        }, 300)

        return () => clearTimeout(timer);
    }, [dispatch, search, status, priority]);

    useEffect(() => {
        const delay = setTimeout(() => {
            if (searchProject.length < 3) return;
            
            dispatch(fetchAllProjects({ page: 1, limit: 20, search: searchProject }));
        }, 300);

        return () => clearTimeout(delay);
    }, [searchProject, dispatch]);

    useEffect(() => {
        const delay = setTimeout(() => {
            if (searchUser.length < 3) return;
            
            dispatch(fetchAllUsers({ page: 1, limit: 20, search: searchUser }));
        }, 300);

        return () => clearTimeout(delay);
    }, [searchUser, dispatch]);

    const statusOption = [
        { label: "To Do", value: "to_do" },
        { label: "In Progress", value: "in_progress"},
        { label: "Review", value: "review"},
        { label: "Done", value: "done"},
    ];

    const priorityOption = [
        { label: "Low", value: "low" },
        { label: "Medium", value: "medium"},
        { label: "High", value: "high"},
    ];

    const formatStatus = (status: string) => {
        const map: Record<string, string> = {
            to_do: "To Do",
            in_progress: "In Progress",
            review: "Review",
            done: "Done"
        };

        return map[status] ?? status;
    };

    const formatPriority = (priority: string) => {
        const map: Record<string, string> = {
            low: "Low",
            medium: "Medium",
            high: "High"
        };

        return map[priority] ?? priority;
    };

    const newTaskInitial: NewTask = {
        project_id: "",
        assign_to: "",
        title: "",
        description: "",
        status: "" as StatusTask | "",
        priority: "" as PriorityTask | "",
        due_date: ""
    };

    const saveNewForm = useForm<TaskSchema>({
        resolver: zodResolver(taskSchema),
        defaultValues: newTaskInitial,
    });

    const handlePageChange = (page: number) => {
        dispatch(fetchAllTasks({ page, limit: 10, search, status, priority }))
    };

    const handleSearch = (payload: { keyword: string; filters: Record<string, string> }) => {
        setSearch(payload.keyword);
        setStatus(payload.filters.status || "");
        setPriority(payload.filters.priority || "");
        dispatch(fetchAllTasks({ page: 1, limit: 10, search: payload.keyword, status: payload.filters.status || "", priority: payload.filters.priority || "" }));
    };

    const tableData = useMemo(() => {
        return taskList.map((tasks) => ({
            id: tasks.id,
            project_id: tasks.project_id,
            assign_to: tasks.assign_to,
            title: tasks.title,
            description: tasks.description,
            status: formatStatus(tasks.status),
            priority: formatPriority(tasks.priority),
            due_date: format(new Date(tasks.due_date), "dd/MM/yyyy"),
        }));
    }, [taskList]);

    const { handleSubmit: rhfSubmit } = saveNewForm;

    const onSubmit = async (data: TaskSchema) => {
        try {
            await dispatch(createTask(data)).unwrap();

            dispatch(setAlert({
                message: "Task created successfully",
                type: "success",
            }));

            dispatch(fetchAllTasks({
                page: currentPage,
                limit: 10,
                search,
                status,
                priority
            }));

            handleResetForm();
            setOpenModal(false);
        } catch (error) {
            dispatch(setAlert({
                message: error as string,
                type: "error"
            }));
        }
    };

    const handleResetForm = () => {
        saveNewForm.reset();
        setSelectedStatus("");
        setSelectedPriority("");
        setDueDate(undefined);

    };

    const openDeleteConfirm = (id: string) => {
        setDeleteId(id);
        setOpenConfirm(true);
    };

    const handleDeleteTask = async (id: string) => {
        if (!deleteId) return;

        try {
            await dispatch(deleteTask(id)).unwrap();

            dispatch(setAlert({
                message: "Task deleted successfully",
                type: "success"
            }));

            dispatch(fetchAllTasks({
                page: currentPage,
                limit: 10,
                search,
                status,
                priority
            }));

            setOpenConfirm(false);
            setDeleteId(null);
        } catch (error) {
            dispatch(setAlert({
                message: error as string,
                type: "error"
            }));
        }
    };

    const fetchTaskDetail = useCallback((id: string) => {
        dispatch(fetchTaskById(id));
    }, [dispatch]);

    const clearTaskDetail = useCallback(() => {
        dispatch(clearSelectedTask());
    }, [dispatch]);

    const humanize = (value: string) => {
        return value
        .split("_")
        .map(word => word[0].toUpperCase() + word.slice(1))
        .join(" ");
    };

    const getStatusBadgeColor = (status: string): string => {
        switch (status.toLowerCase()) {
            case "to_do":
                return "bg-purple-100 text-purple-700 hover:bg-purple-200";
            case "in_progress":
                return "bg-blue-100 text-blue-700 hover:bg-blue-200";
            case "review":
                return "bg-yellow-100 text-yellow-700 hover:bg-yellow-200";
            case "done":
                return "bg-green-100 text-green-700 hover:bg-green-200";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getPriorityBadgeColor = (priority: string): string => {
        switch (priority.toLowerCase()) {
            case "low":
                return "bg-green-100 text-green-700 hover:bg-green-200";
            case "medium":
                return "bg-yellow-100 text-yellow-700 hover:bg-yellow-200";
            case "high":
                return "bg-red-100 text-red-700 hover:bg-red-200";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const updateTaskInitial = useCallback((task: Task): TaskUpdateSchema => ({
        project_id: task.project_id,
        assign_to: task.assign_to,
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        due_date: format(new Date(task.due_date), "yyyy-MM-dd")
    }), []);

    const updateTaskForm = useForm<TaskUpdateSchema>({
        resolver: zodResolver(taskUpdateSchema)
    });

    const onSubmitUpdate = useCallback(async (id: string, payload: TaskUpdateSchema) => {
        try {
            await dispatch(updateTask({id, payload})).unwrap();

            dispatch(setAlert({
                message: "Task update successfully",
                type: "success"
            }));

            setIsEditMode(false);
            dispatch(fetchTaskById(id));
        } catch (error) {
            dispatch(setAlert({
                message: error as string,
                type: "error"
            }));
        }
    }, [dispatch]);

    const handleEditClick = useCallback((task: Task) => {
        updateTaskForm.reset({
            title: task.title,
            description: task.description,
            priority: task.priority,
            status: task.status,
            due_date: task.due_date
        });
        setIsEditMode(true);
    }, [updateTaskForm]);

    const handleCancelEdit = useCallback(() => {
        setIsEditMode(false);
        updateTaskForm.reset();
    }, [updateTaskForm]);

    const handleSubmitUpdate = useCallback((id: string) => {
        return updateTaskForm.handleSubmit((data: TaskUpdateSchema) => {
            if (!data) return;

            onSubmitUpdate(id, data);
        })
    }, [updateTaskForm, onSubmitUpdate]);

    return {
        taskList,
        userList,
        projectList,
        selectedTask,
        currentPage,
        totalData,
        totalPages,
        loadingFetch,
        loadingDetail,
        loadingMutation,
        errorFetch,
        errorMutation,
        search,
        setSearch,
        status,
        setStatus,
        priority,
        setPriority,
        searchProject,
        setSearchProject,
        searchUser,
        setSearchUser,
        taskTitle,
        setTaskTitle,
        description,
        setDescription,
        selectedPriority,
        setSelectedPriority,
        selectedStatus,
        setSelectedStatus,
        dueDate,
        setDueDate,
        openModal,
        setOpenModal,
        openConfirm,
        setOpenConfirm,
        isEditMode,
        setIsEditMode,
        deleteId,
        setDeleteId,
        statusOption,
        priorityOption,
        formatStatus,
        formatPriority,
        saveNewForm,
        handlePageChange,
        handleSearch,
        tableData,
        onSubmit,
        handleSubmit: rhfSubmit(onSubmit),
        handleResetForm,
        openDeleteConfirm,
        handleDeleteTask,
        fetchTaskDetail,
        clearTaskDetail,
        humanize,
        getStatusBadgeColor,
        getPriorityBadgeColor,
        updateTaskInitial,
        updateTaskForm,
        onSubmitUpdate,
        handleEditClick,
        handleCancelEdit,
        handleSubmitUpdate
    };
};