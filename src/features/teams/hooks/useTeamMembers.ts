import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { setAlert } from "@/app/state/alertSlice";
import { createTeamMember, deleteTeamMember, fetchTeamMembersByTeamId } from "../store/teamsMemberSlice";
import { fetchAllUsers } from "@/features/users/store/usersSlice";
import { teamsMemberSchema } from "../schemas/teamsMember.schema";
import type { AppDispatch, RootState } from "@/store";
import type { TeamsMemberSchema } from "../schemas/teamsMember.schema";

type RoleInTeam = "owner" | "lead" | "member";

interface NewTeamMember {
    team_id: string;
    user_id: string;
    role: RoleInTeam | "";
};

export const useTeamMembers = (teamId: string, isEditModeProp?: boolean) => {
    const dispatch = useDispatch<AppDispatch>();
    const hasInitialized = useRef(false);

    const [searchUser, setSearchUser] = useState<string>("");
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [openConfirm, setOpenConfirm] = useState<boolean>(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isEditModeLocal, setIsEditModeLocal] = useState<boolean>(isEditModeProp || false);

    const {
        memberList: teamMemberList,
        currentPage,
        totalData,
        totalPages,
        loadingFetch,
        loadingMutation,
        errorFetch,
        errorMutation,
    } = useSelector((state: RootState) => state.teamMembers);

    const { userList } = useSelector((state: RootState) => state.users);

    const roleOptions = [
        { label: "Owner", value: "owner" },
        { label: "Lead", value: "lead" },
        { label: "Member", value: "member" },
    ];

    useEffect(() => {
        if(!hasInitialized.current) {
            dispatch(fetchTeamMembersByTeamId({ teamId }));
            hasInitialized.current = true;
        }
    }, [dispatch, teamId]);

    useEffect(() => {
        if (!hasInitialized.current) return;

        const timer = setTimeout(() => {
            dispatch(fetchTeamMembersByTeamId({ teamId }));
        })

        return () => clearTimeout(timer);
    }, [dispatch, teamId]);

    useEffect(() => {
        const delay = setTimeout(() => {
            if (searchUser.length < 3) return;
            
            dispatch(fetchAllUsers({ page: 1, limit: 20, search: searchUser }));
        }, 300);
        
        return () => clearTimeout(delay);
    }, [searchUser, dispatch]);

    const newTeamMemberInitial: NewTeamMember = {
        team_id: teamId,
        user_id: "",
        role: "",
    };

    const saveNewForm = useForm<TeamsMemberSchema>({
        resolver: zodResolver(teamsMemberSchema),
        defaultValues: newTeamMemberInitial,
    });

    const handleResetForm = () => {
        saveNewForm.reset();
    };

    const { handleSubmit: rfhSubmit } = saveNewForm;

    const onSubmit = async (data: TeamsMemberSchema) => {
        try {
            await dispatch(createTeamMember(data)).unwrap();

            dispatch(setAlert({
                message: "Added member successfully",
                type: "success",
            }));

            dispatch(fetchTeamMembersByTeamId({ teamId }));

            handleResetForm();
            setOpenModal(false);
        } catch (error) {
            dispatch(setAlert({
                message: error as string,
                type: "error",
            }));
        }
    };

    const openDeleteConfirm = (id: string) => {
        setDeleteId(id);
        setOpenConfirm(true);
    };

    const handleDeleteMember = async (id: string) => {
        if (!deleteId) return;

        try {
            await dispatch(deleteTeamMember(id)).unwrap();

            dispatch(setAlert({
                message: "Member delete successfully",
                type: "success",
            }));

            dispatch(fetchTeamMembersByTeamId({ teamId }));

            setOpenConfirm(false);
            setDeleteId(null);
        } catch (error) {
            dispatch(setAlert({
                message: error as string,
                type: "error",
            }));
        }
    };

    return {
        teamMemberList,
        roleOptions,
        userList,
        currentPage,
        totalData,
        totalPages,
        loadingFetch,
        loadingMutation,
        errorFetch,
        errorMutation,
        openModal,
        setOpenModal,
        openConfirm,
        setOpenConfirm,
        isEditMode: isEditModeProp !== undefined ? isEditModeProp : isEditModeLocal,
        setIsEditMode: setIsEditModeLocal,
        saveNewForm,
        onSubmit,
        handleSubmit: rfhSubmit(onSubmit),
        handleResetForm,
        openDeleteConfirm,
        handleDeleteMember,
        deleteId,
        searchUser,
        setSearchUser
    };
}