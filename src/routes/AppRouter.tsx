import { BrowserRouter, Routes, Route } from "react-router-dom"
import LoginPage from "@/pages/auth/LoginPage"
import ProtectedRoute from "./ProtectedRoute"

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<div>Ini Dashboard</div>} />
        </Route>
        
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </BrowserRouter>
  )
}
