import axios from "axios"
import { store } from "@/store"
import { logout } from "@/features/auth/store/authSlice";
import { tokenService } from "@/features/auth/services/token.service";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: true,
})

api.interceptors.request.use(
  (config) => {
    const token = tokenService.get()
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status

    const isLoginRequest = error.config?.url?.includes('/auth/login');

    if (status === 401 && !isLoginRequest) {
      tokenService.remove();
      store.dispatch(logout());
      window.location.href = '/';
    }

    return Promise.reject(error)
  }
);

export default api