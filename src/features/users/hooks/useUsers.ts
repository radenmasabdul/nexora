import { useState, useEffect, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { setAlert } from "@/app/state/alertSlice";
import { fetchAllUsers, fetchUserById, fetchRoleCounts, createUser, deleteUser, clearSelectedUser } from "../store/usersSlice";
import { usersSchema } from "../schemas/users.schema";
import type { AppDispatch, RootState } from "@/store";
import type { UsersSchema} from "../schemas/users.schema";
import { format } from "date-fns";

type UserRole = "admin" | "manager" | "member";

interface NewUsers {
  name: string;
  email: string;
  password: string;
  role: UserRole | "";
  avatar_url?: string;
}

export const useUsers = () => {
  const dispatch = useDispatch<AppDispatch>();

  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [selectedFormRole, setSelectedFormRole] = useState<UserRole | "">("");
  const [showPassword, setShowPassword] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const {
    userList,
    selectedUser,
    currentPage,
    totalData,
    totalPages,
    roleCounts,
    loadingFetch,
    loadingMutation,
    loadingRoleCounts,
    errorFetch,
    errorMutation,
  } = useSelector((state: RootState) => state.users);

  useEffect(() => {
    dispatch(fetchAllUsers({ page: 1, limit: 10, search, role }));
  }, [dispatch, search, role]);

  useEffect(() => {
    dispatch(fetchRoleCounts());
  }, [dispatch]);

  const roleOptions = [
    { label: "Admin", value: "admin" },
    { label: "Manager", value: "manager" },
    { label: "Member", value: "member" },
  ];

  const newUserInitial: NewUsers = {
    name: "",
    email: "",
    password: "",
    role: "" as UserRole | "",
    avatar_url: "",
  };

  const saveNewForm = useForm<UsersSchema>({
    resolver: zodResolver(usersSchema),
    defaultValues: newUserInitial,
  })

  const handlePageChange = (page: number) => {
    dispatch(fetchAllUsers({ page, limit: 10, search, role }));
  };

  const handleSearch = (payload: { keyword: string; filter: string }) => {
    setSearch(payload.keyword);
    setRole(payload.filter);
    dispatch(fetchAllUsers({ page: 1, limit: 10, search: payload.keyword, role: payload.filter }));
  };

  const tableData = useMemo(() => {
    return userList.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      join: format(new Date(user.created_at), "dd/MM/yyyy"),
      avatar: user.avatar_url,
    }));
  }, [userList]);

  const togglePassword = () => setShowPassword(prev => !prev);

  const { handleSubmit: rhfSubmit } = saveNewForm;
  
  const onSubmit = async (data: UsersSchema) => {
    try {
      await dispatch(createUser(data)).unwrap();

      dispatch(setAlert({
        message: "User created successfully",
        type: "success",
      }));

      dispatch(fetchAllUsers({
        page: currentPage,
        limit: 10,
        search,
        role,
      }));

      handleResetForm();
      setOpenModal(false);
    } catch (error) {
      dispatch(setAlert({
      message: error as string,
      type: "error",
    }));
    }
  }

  const handleResetForm = () => {
    saveNewForm.reset();
    setSelectedFormRole("");
    setShowPassword(false);
  };

  const openDeleteConfirm = (id: string) => {
    setDeleteId(id);
    setOpenConfirm(true);
  }

  const handleDeleteUser = async (id: string) => {
    if (!deleteId) return;

    try {
      await dispatch(deleteUser(id)).unwrap();

      dispatch(setAlert({
        message: "User delete successfully",
        type: "success",
      }));

      dispatch(fetchAllUsers({
        page: currentPage,
        limit: 10,
        search,
        role,
      }));

      setOpenConfirm(false);
      setDeleteId(null);
    } catch (error) {
      dispatch(setAlert({
        message: error as string,
        type: "error",
      }));
    }
  }

  const fetchUserDetail = useCallback((id: string) => {
    dispatch(fetchUserById(id));
  }, [dispatch]);

  const clearUserDetail = useCallback(() => {
    dispatch(clearSelectedUser());
  }, [dispatch]);

  const getInitials = (name: string): string => name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

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
  
  const getRoleBadgeColor = (role: string): string => {
    switch (role.toLowerCase()) {
      case "admin":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      case "manager":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "member":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return {
    userList,
    selectedUser,
    currentPage,
    totalData,
    totalPages,
    loadingFetch,
    loadingMutation,
    loadingRoleCounts,
    errorFetch,
    errorMutation,
    tableData,
    handlePageChange,
    handleSearch,
    roleOptions,
    roleCounts,
    selectedFormRole,
    setSelectedFormRole,
    showPassword,
    togglePassword,
    saveNewForm,
    onSubmit,
    handleSubmit: rhfSubmit(onSubmit),
    handleResetForm,
    openModal,
    setOpenModal,
    openConfirm,
    setOpenConfirm,
    openDeleteConfirm,
    handleDeleteUser,
    deleteId,
    fetchUserDetail,
    clearUserDetail,
    getInitials,
    formatDate,
    getRoleBadgeColor,
  };
};