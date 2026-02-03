import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { setAlert } from "@/app/state/alertSlice";
import { 
    fetchAllTeams,
    fetchTeamById,
    createTeam,
    updateTeam,
    deleteTeam,
    clearSelectedTeam,
    type Team
} from "../store/teamsSlice";
import { teamsSchema, teamsUpdateSchema } from "../schemas/teams.schema";
import type { AppDispatch, RootState } from "@/store";
import type { TeamsSchema, TeamsUpdateSchema } from "../schemas/teams.schema";

interface NewTeams {
    name: string;
    description: string;
}

export const useTeams = () => {
    const dispatch = useDispatch<AppDispatch>();
    const hasInitialized = useRef(false);
    
    const [search, setSearch] = useState<string>("");
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [openConfirm, setOpenConfirm] = useState<boolean>(false);
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const {
        teamList,
        selectedTeam,
        currentPage,
        totalData,
        totalPages,
        loadingFetch,
        loadingDetail,
        loadingMutation,
        errorFetch,
        errorMutation,
    } = useSelector((state: RootState) => state.teams);

    useEffect(() => {
        if(!hasInitialized.current) {
            dispatch(fetchAllTeams({ page: 1, limit: 10, search: "" }));
            hasInitialized.current = true;
        }
    }, [dispatch]);

    useEffect(() => {
        if (!hasInitialized.current) return;

        const timer = setTimeout(() => {
            dispatch(fetchAllTeams({ page: 1, limit: 10, search }));
        })

        return () => clearTimeout(timer);
    }, [dispatch, search]);

    const newTeamsInitial: NewTeams = {
        name: "",
        description: "",
    };

    const saveNewForm = useForm<TeamsSchema>({
        resolver: zodResolver(teamsSchema),
        defaultValues: newTeamsInitial,
    });

    const handlePageChange = (page: number) => {
        dispatch(fetchAllTeams({ page, limit: 10, search }));
    };

    const handleSearch = (payload: {keyword: string}) => {
        setSearch(payload.keyword);
        dispatch(fetchAllTeams({ page: 1, limit: 10, search: payload.keyword }));
    };

    const handleResetForm = () => {
        saveNewForm.reset();
    };

    const tableData = useMemo(() => {
        return teamList.map((team) => ({
            id: team.id,
            name: team.name,
            description: team.description,
            created_at: team.created_at,
        }));
    }, [teamList]);

    const { handleSubmit: rhfSubmit } = saveNewForm;

    const onSubmit = async (data: TeamsSchema) => {
        try {
            await dispatch(createTeam(data)).unwrap();

            dispatch(setAlert({
                message: "Team created successfully",
                type: "success",
            }));

            dispatch(fetchAllTeams({
                page: currentPage,
                limit: 10,
                search,
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

    const openDeleteConfirm = (id: string) => {
        setDeleteId(id);
        setOpenConfirm(true);
    };

    const handleDeleteTeam = async (id: string) => {
        if (!deleteId) return;

        try {
            await dispatch(deleteTeam(id)).unwrap();

            dispatch(setAlert({
                message: "Team delete successfully",
                type: "success"
            }));

            dispatch(fetchAllTeams({
                page: currentPage,
                limit: 10,
                search,
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

    const fetchTeamDetail = useCallback((id: string) => {
        dispatch(fetchTeamById(id));
    }, [dispatch]);

    const clearTeamDetail = useCallback(() => {
        dispatch(clearSelectedTeam());
    }, [dispatch]);

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);

        return new Intl.DateTimeFormat("id-ID", {
            day: "2-digit",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(date);
    };

    const updateTeamInitial = useCallback((team: Team): TeamsUpdateSchema => ({
        name: team.name,
        description: team.description
    }), []);

    const updateTeamForm = useForm<TeamsUpdateSchema>({
        resolver: zodResolver(teamsUpdateSchema),
    });

    const onSubmitUpdate = useCallback(async (id: string, payload: TeamsUpdateSchema) => {
        try {
            await dispatch(updateTeam({ id, payload })).unwrap();

            dispatch(setAlert({
                message: "Team update successfully",
                type: "success",
            }));

            setIsEditMode(false);
            dispatch(fetchTeamById(id));
        } catch (error) {
            dispatch(setAlert({
                message: error as string,
                type: "error"
            }));
        }
    }, [dispatch]);

    const handleEditClick = useCallback((team: Team) => {
        updateTeamForm.reset({
            name: team.name,
            description: team.description
        });
        setIsEditMode(true);
    }, [updateTeamForm]);

    const handleCancelEdit = useCallback(() => {
        setIsEditMode(false);
        updateTeamForm.reset();
    }, [updateTeamForm]);

    const handleSubmitUpdate = useCallback((id: string) => {
        return updateTeamForm.handleSubmit((data: TeamsUpdateSchema) => {
            if (!data) return;

            onSubmitUpdate(id, data);
        })
    }, [updateTeamForm, onSubmitUpdate]);

    return {
        teamList,
        selectedTeam,
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
        search,
        setSearch,
        handleSearch,
        saveNewForm,
        onSubmit,
        handleSubmit: rhfSubmit(onSubmit),
        handleResetForm,
        openModal,
        setOpenModal,
        openConfirm,
        setOpenConfirm,
        openDeleteConfirm,
        handleDeleteTeam,
        deleteId,
        fetchTeamDetail,
        clearTeamDetail,
        isEditMode,
        setIsEditMode,
        updateTeamForm,
        onSubmitUpdate,
        formatDate,
        updateTeamInitial,
        handleEditClick,
        handleCancelEdit,
        handleSubmitUpdate,
    };
};