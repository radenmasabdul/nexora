import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { hydrateAuth, logout } from "../store/authSlice"
import type { AppDispatch } from "@/store"

interface StoredAuth {
  token: string
  user: {
    id: string
    name: string
    email: string
  } | null
}

export function useAuthHydration() {
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    const stored = localStorage.getItem('auth')
    if (!stored) {
      dispatch(logout())
      return
    }

    try {
      const parsed: StoredAuth = JSON.parse(stored)
      if (!parsed.token) {
        dispatch(logout())
        return
      }

      dispatch(hydrateAuth({
        token: parsed.token,
        user: parsed.user,
      }))
    } catch (error) {
      console.error('Failed to parse auth from localStorage:', error)
      dispatch(logout())
    }
  }, [dispatch])
}