import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { setAlert } from "@/app/state/alertSlice";
import {
  fetchAllUsers,
  fetchUserById,
  fetchRoleCounts,
  createUser,
  updateUser,
  deleteUser,
  clearSelectedUser, 
  type User
} from "../store/usersSlice";
import { usersSchema, usersUpdateSchema } from "../schemas/users.schema";
import type { AppDispatch, RootState } from "@/store";
import type { UsersSchema, UsersUpdateSchema} from "../schemas/users.schema";
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
  const hasInitialized = useRef(false);
  const hasFetchedRoles = useRef(false);

  const [search, setSearch] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [selectedFormRole, setSelectedFormRole] = useState<UserRole | "">("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openConfirm, setOpenConfirm] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const {
    userList,
    selectedUser,
    currentPage,
    totalData,
    totalPages,
    roleCounts,
    loadingFetch,
    loadingDetail,
    loadingMutation,
    loadingRoleCounts,
    errorFetch,
    errorMutation,
  } = useSelector((state: RootState) => state.users);

  useEffect(() => {
    if (!hasInitialized.current) {
      dispatch(fetchAllUsers({ page: 1, limit: 10, search: "", role: "" }));
      hasInitialized.current = true;
    }
  }, [dispatch]);

  useEffect(() => {
    if (!hasInitialized.current) return;

    const timer = setTimeout(() => {
      dispatch(fetchAllUsers({ page: 1, limit: 10, search, role }));
    }, 300);

    return () => clearTimeout(timer);
  }, [dispatch, search, role]);

  useEffect(() => {
    if (!hasFetchedRoles.current) {
      dispatch(fetchRoleCounts());
      hasFetchedRoles.current = true;
    }
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

  const updateUserInitial = useCallback((user: User): UsersUpdateSchema => ({
    name: user.name,
    email: user.email,
    password: "",
    role: user.role,
    avatar_url: user.avatar_url || "",
  }), []);

  const updateUserForm = useForm<UsersUpdateSchema>({
    resolver: zodResolver(usersUpdateSchema),
  });

  const onSubmitUpdate = useCallback(async (id: string, formData: FormData) => {
    try {
      await dispatch(updateUser({ id, payload: formData })).unwrap();

      dispatch(setAlert({
        message: "User updated successfully",
        type: "success",
      }));

      setIsEditMode(false);
      dispatch(fetchUserById(id));
    } catch (error) {
      dispatch(setAlert({
        message: error as string,
        type: "error",
      }));
    }
  }, [dispatch]);

  const handleEditClick = useCallback((user: User) => {
    updateUserForm.reset({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
      avatar_url: user.avatar_url || "",
    });
    setIsEditMode(true);
  }, [updateUserForm]);

  const handleCancelEdit = useCallback(() => {
    setIsEditMode(false);
    setPreviewAvatar(null);
    updateUserForm.reset();
  }, [updateUserForm]);

  const handleOpenCamera = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleAvatarChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setPreviewAvatar(previewUrl);

    updateUserForm.setValue("avatar_url", file);
  }, [updateUserForm]);

  const handleSubmitUpdate = useCallback((id: string) => {
    return updateUserForm.handleSubmit((data: UsersUpdateSchema) => {
      if (!data) return;

      const formData = new FormData();

      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("role", data.role);

      if (data.password) {
        formData.append("password", data.password);
      }

      if (data.avatar_url instanceof File) {
        formData.append("avatar", data.avatar_url); 
      }

      onSubmitUpdate(id, formData);
      setPreviewAvatar(null);
    });
  }, [updateUserForm, onSubmitUpdate]);

  return {
    userList,
    selectedUser,
    currentPage,
    totalData,
    totalPages,
    loadingFetch,
    loadingDetail,
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
    isEditMode,
    setIsEditMode,
    updateUserForm,
    onSubmitUpdate,
    updateUserInitial,
    previewAvatar,
    setPreviewAvatar,
    fileInputRef,
    handleEditClick,
    handleCancelEdit,
    handleOpenCamera,
    handleAvatarChange,
    handleSubmitUpdate,
  };
};