import { BrowserRouter, Routes, Route } from "react-router-dom"
import ProtectedRoute from "./ProtectedRoute"
import AppLayout from "@/components/layout/layout/sidebar/AppLayout"
import LoginPage from "@/pages/auth/LoginPage"
import DashboardPage from "@/pages/dashboard/DashboardPage"
import UsersPage from "@/pages/users/UsersPage"
import UsersDetail from "@/features/users/pages/detail/UsersDetail"
import TeamsPage from "@/pages/teams/TeamPage"
import TeamsDetail from "@/features/teams/pages/detail/TeamsDetail"
import ProjectsPage from "@/pages/projects/ProjectsPage"
import ProjectDetail from "@/features/projects/pages/detail/ProjectDetail"

import NotFound from "@/pages/NotFound"

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/users/:id" element={<UsersDetail />} />
            <Route path="/teams" element={<TeamsPage />} />
            <Route path="/teams/:id" element={<TeamsDetail />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />
          </Route>
        </Route>
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
 )
}