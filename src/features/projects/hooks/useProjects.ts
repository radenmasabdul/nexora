import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { setAlert } from "@/app/state/alertSlice";
import {
    fetchAllProjects,
    fetchProjectById,
    createProject,
    updateProject,
    deleteProject,
    clearSelectedProject,
    type Project,
} from "../store/projectsSlice";
import { fetchAllTeams } from "@/features/teams/store/teamsSlice";
import { projectsSchema, projectUpdateSchema } from "../schemas/projects.schema";
import type { AppDispatch, RootState } from "@/store";
import type { ProjectsSchema, ProjectsUpdateSchema } from "../schemas/projects.schema";
import { format } from "date-fns";

type StatusProjects = "planning" | "in_progress" | "on_hold" | "completed";

interface NewProject {
    team_id: string;
    name: string;
    description: string;
    status: StatusProjects | "";
    deadline: string;
}

export const useProjects = () => {
    const dispatch = useDispatch<AppDispatch>();
    const hasInitialized = useRef(false);

    const [search, setSearch] = useState<string>("");
    const [status, setStatus] = useState<string>("");

    const [searchTeam, setSearchTeam] = useState<string>("");
    const [projectName, setProjectName] = useState<string>("");
    const [projectDescription, setProjectDescription] = useState<string>("");
    const [selectedFormStatus, setSelectedFormStatus] = useState<StatusProjects | "">("");
    const [projectDeadline, setProjectDeadline] = useState<Date | undefined>(undefined);

    const [openModal, setOpenModal] = useState<boolean>(false);
    const [openConfirm, setOpenConfirm] = useState<boolean>(false);
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const {
        projectList,
        selectedProject,
        currentPage,
        totalData,
        totalPages,
        loadingFetch,
        loadingDetail,
        loadingMutation,
        errorFetch,
        errorMutation,
    } = useSelector((state: RootState) => state.projects);

    const { teamList } = useSelector((state: RootState) => state.teams);

    useEffect(() => {
        if(!hasInitialized.current) {
            dispatch(fetchAllProjects({ page: 1, limit: 10, search: "", status: "" }));
            hasInitialized.current = true;
        }
    }, [dispatch]);

    useEffect(() => {
        if(!hasInitialized.current) return;

        const timer = setTimeout(() => {
            dispatch(fetchAllProjects({ page: 1, limit: 10, search, status }));
        }, 300)

        return () => clearTimeout(timer);
    }, [dispatch, search, status]);

    useEffect(() => {
        const delay = setTimeout(() => {
            if (searchTeam.length < 3) return;

            dispatch(fetchAllTeams({ page: 1, limit: 20, search: searchTeam}));
        }, 300);

        return () => clearTimeout(delay);
    }, [searchTeam, dispatch]);

    const statusOptions = [
        { label: "Planning", value: "planning" },
        { label: "In Progress", value: "in_progress" },
        { label: "Hold", value: "on_hold" },
        { label: "Completed", value: "completed" },
    ];

    const formatStatus = (status: string) => {
        const map: Record<string, string> = {
            planning: "Planning",
            in_progress: "In Progress",
            on_hold: "Hold",
            completed: "Completed",
        };
        
        return map[status] ?? status;
    };

    const newProjectsInitial: NewProject = {
        team_id: "",
        name: "",
        description: "",
        status: "" as StatusProjects | "",
        deadline: "",
    };

    const saveNewForm = useForm<ProjectsSchema>({
        resolver: zodResolver(projectsSchema),
        defaultValues: newProjectsInitial,
    });

    const handlePageChange = (page: number) => {
        dispatch(fetchAllProjects({ page, limit: 10, search, status }))
    };

    const handleSearch = (payload: { keyword: string; filters: Record<string, string> }) => {
        setSearch(payload.keyword);
        setStatus(payload.filters.status || "")
        dispatch(fetchAllProjects({ page: 1, limit: 10, search: payload.keyword, status: payload.filters.status || "" }))
    };

    const tableData = useMemo(() => {
        return projectList.map((projects) => ({
            id: projects.id,
            team_id: projects.team_id,
            name: projects.name,
            description: projects.description,
            status: formatStatus(projects.status),
            deadline: format(new Date(projects.deadline), "dd/MM/yyyy"),
        }))
    }, [projectList]);

    const { handleSubmit: rhfSubmit } = saveNewForm;

    const onSubmit = async (data: ProjectsSchema) => {
        try {
            await dispatch(createProject(data)).unwrap();

            dispatch(setAlert({
                message: "Project created successfully",
                type: "success",
            }));

            dispatch(fetchAllProjects({
                page: currentPage,
                limit: 10,
                search,
                status
            }));

            handleResetForm();
            setOpenModal(false);
        } catch (error) {
            dispatch(setAlert({
                message: error as string,
                type: 'error',
            }));
        }
    };

    const handleResetForm = () => {
        saveNewForm.reset();
        setSelectedFormStatus("");
        setProjectDeadline(undefined);
    };

    const openDeleteConfirm = (id: string) => {
        setDeleteId(id);
        setOpenConfirm(true);
    };

    const handleDeleteProject = async (id: string) => {
        if (!deleteId) return;

        try {
            await dispatch(deleteProject(id)).unwrap();

            dispatch(setAlert({
                message: "Project deleted successfully",
                type: "success",
            }));

            dispatch(fetchAllProjects({
                page: currentPage,
                limit: 10,
                search,
                status
            }));

            setOpenConfirm(false);
            setDeleteId(null);
        } catch (error) {
            dispatch(setAlert({
                message: error as string,
                type: "error"
            })); 
        }
    }

    const fetchProjectsDetail = useCallback((id: string) => {
        dispatch(fetchProjectById(id));
    }, [dispatch]);

    const clearProjectDetail = useCallback(() => {
        dispatch(clearSelectedProject());
    }, [dispatch]);

    const humanizeStatus = (status: string) => {
        return status
        .split("_")
        .map(word => word[0].toUpperCase() + word.slice(1))
        .join(" ");
    };
  
    const getStatusBadgeColor = (status: string): string => {
        switch (status.toLowerCase()) {
            case "planning":
                return "bg-purple-100 text-purple-800 hover:bg-purple-200";
            case "in_progress":
                return "bg-blue-100 text-blue-800 hover:bg-blue-200";
            case "on_hold":
                return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
            case "completed":
                return "bg-green-100 text-green-800 hover:bg-green-200";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const updateProjectInitial = useCallback((project: Project): ProjectsUpdateSchema => ({
        team_id: project.team_id,
        name: project.name,
        description: project.description,
        status: project.status,
        deadline: format(new Date(project.deadline), "yyyy-MM-dd"),
    }), []);

    const updateProjectForm = useForm<ProjectsUpdateSchema>({
        resolver: zodResolver(projectUpdateSchema),
    });

    const onSubmitUpdate = useCallback(async (id: string, payload: ProjectsUpdateSchema) => {
        try {
            await dispatch(updateProject({id, payload})).unwrap();

            dispatch(setAlert({
                message: "Project update successfully",
                type: "success"
            }));

            setIsEditMode(false);
            dispatch(fetchProjectById(id));
        } catch (error) {
            dispatch(setAlert({
                message: error as string,
                type: "error"
            }));
        }
    }, [dispatch]);

    const handleEditClick = useCallback((project: Project) => {
        updateProjectForm.reset({
            name: project.name,
            description: project.description,
            status: project.status,
            deadline: project.deadline
        });
        setIsEditMode(true);
    }, [updateProjectForm]);

    const handleCancelEdit = useCallback(() => {
        setIsEditMode(false);
        updateProjectForm.reset();
    }, [updateProjectForm])

    const handleSubmitUpdate = useCallback((id: string) => {
        return updateProjectForm.handleSubmit((data: ProjectsUpdateSchema) => {
            if (!data) return;

            onSubmitUpdate(id, data);
        })
    }, [updateProjectForm, onSubmitUpdate])

    return {
        projectList,
        teamList,
        selectedProject,
        currentPage,
        totalData,
        totalPages,
        loadingFetch,
        loadingDetail,
        loadingMutation,
        errorFetch,
        errorMutation,
        tableData,
        handlePageChange,
        projectName,
        setProjectName,
        projectDescription,
        setProjectDescription,
        selectedFormStatus,
        setSelectedFormStatus,
        projectDeadline,
        setProjectDeadline,
        search,
        setSearch,
        handleSearch,
        statusOptions,
        saveNewForm,
        onSubmit,
        handleSubmit: rhfSubmit(onSubmit),
        handleResetForm,
        openModal,
        setOpenModal,
        openConfirm,
        setOpenConfirm,
        openDeleteConfirm,
        handleDeleteProject,
        deleteId,
        fetchProjectsDetail,
        clearProjectDetail,
        isEditMode,
        setIsEditMode,
        humanizeStatus,
        getStatusBadgeColor,
        updateProjectForm,
        onSubmitUpdate,
        updateProjectInitial,
        handleEditClick,
        handleCancelEdit,
        handleSubmitUpdate,
        searchTeam,
        setSearchTeam
    };
}