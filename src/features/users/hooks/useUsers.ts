import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store";
import { fetchAllUsers } from "../store/usersSlice";

export const useUsers = () => {
  const dispatch = useDispatch<AppDispatch>();

  const {
    userList,
    selectedUser,

    currentPage,
    totalData,
    totalPages,

    loadingFetch,
    loadingMutation,
    errorFetch,
    errorMutation,
  } = useSelector((state: RootState) => state.users);

  useEffect(() => {
    dispatch(fetchAllUsers({ page: 1, limit: 10 }));
  }, [dispatch]);

  const handlePageChange = (page: number) => {
    dispatch(fetchAllUsers({ page, limit: 10 }));
  };

  const tableData = useMemo(() => {
    return userList.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      join: user.created_at,
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
    errorFetch,
    errorMutation,

    tableData,
    handlePageChange,
  };
};
