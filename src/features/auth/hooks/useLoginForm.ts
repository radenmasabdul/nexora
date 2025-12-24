import { useState } from 'react';
import { useNavigate } from "react-router-dom"
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch } from 'react-redux';
import { loginSchema } from '../schemas/login.schema';
import { authApi } from '../services/auth.api';
import { loginSuccess } from '../store/authSlice';
import { setAlert } from '@/app/state/alertSlice';
import type { LoginSchema } from '../schemas/login.schema';
import type { AppDispatch } from '@/store';

interface User {
  id: string;
  name: string;
  email: string;
}

interface LoginResponse {
  user: User;
  token: string;
  message?: string;
}

export function useLoginForm() {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const togglePassword = () => setShowPassword(prev => !prev)

  const onSubmit = async (values: LoginSchema) => {    
    try {
      setIsLoading(true)

      const res: LoginResponse = await authApi.login(values);

      dispatch(
        loginSuccess({
          user: res.user,
          token: res.token,
        })
      )

      dispatch(setAlert({
        message: res.message || 'Login successful',
        type: 'success',
      }));

      navigate("/dashboard", { replace: true })

    } catch (err: unknown) {
      console.error(err)
      
      let errorMessage = 'Login failed';

      if (err && typeof err === 'object' && 'response' in err) {
        const e = err as { response?: { data?: { message?: string } } };
        errorMessage = e.response?.data?.message ?? errorMessage;
      }

      dispatch(setAlert({
        message: errorMessage,
        type: 'error',
      }));
    } finally {
      setIsLoading(false)
    }
  };

  return {
    form,
    showPassword,
    togglePassword,
    isLoading,
    onSubmit,
  };
}
