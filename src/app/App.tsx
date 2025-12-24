import { useAuthHydration } from "@/features/auth/hooks/useAuthHydration"
import AppRouter from "@/routes/AppRouter"

function App() {
  useAuthHydration ()

  return (
    <AppRouter />
  )
}

export default App