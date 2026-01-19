import { useEffect } from "react"
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@/store';
import { fetchDashboard } from "../store/dashboardSlice";

export default function DashboardPage() {
    const dispatch = useDispatch<AppDispatch>()

    useEffect(() => {
        dispatch(fetchDashboard());
  }, [dispatch]);

  return (
    <div>DashboardPage</div>
  )
}
