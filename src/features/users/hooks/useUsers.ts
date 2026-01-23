import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store";
import { fetchAllUsers, fetchRoleCounts } from "../store/usersSlice";
import { format } from "date-fns";

export const useUsers = () => {
  const dispatch = useDispatch<AppDispatch>();

  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");

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

  const handlePageChange = (page: number) => {
    dispatch(fetchAllUsers({ page, limit: 10, search, role }));
  };

  const handleSearch = (payload: { keyword: string; filter: string }) => {
    setSearch(payload.keyword);
    setRole(payload.filter);
    dispatch(fetchAllUsers({ page: 1, limit: 10, search: payload.keyword, role: payload.filter }));
  };

  const roleOptions = [
    { label: "Admin", value: "admin" },
    { label: "Manager", value: "manager" },
    { label: "Member", value: "member" },
  ];

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
  };
};
