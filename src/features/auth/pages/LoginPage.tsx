import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import Logo from "@/assets/logo.png"

import { useLoginForm } from '../hooks/useLoginForm';

export default function LoginPage() {
    const {
        form,
        showPassword,
        togglePassword,
        isLoading,
        onSubmit,
    } = useLoginForm();

    const {
      register,
      handleSubmit,
      formState: { errors },
    } = form;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-linear-to-br from-blue-50 via-slate-50 to-gray-100"></div>
        <div className="absolute top-20 right-20 w-96 h-96 rounded-full bg-blue-100 mix-blend-multiply filter blur-3xl opacity-40"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 rounded-full bg-slate-200 mix-blend-multiply filter blur-3xl opacity-40"></div>
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 shadow-lg bg-linear-to-br from-blue-600 to-slate-700">
            <img src={Logo} alt="Logo" className="w-10 h-10" />
          </div>

          <h1 className="text-4xl font-bold text-slate-800 mb-2">Nexora</h1>
          <p className="text-slate-600">Smart Internal Dashboard for Modern Teams</p>
        </div>

        <Card className="bg-white border-slate-200 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-slate-800">Welcome Back</CardTitle>
            <CardDescription className="text-slate-600">
              Enter your credentials to access your dashboard
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-5"
              noValidate
            >
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700"> Email Address </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    {...register('email')}
                    className={`pl-11 bg-white border-slate-200 text-slate-800 placeholder:text-slate-400 focus-visible:ring-blue-500
                      ${ errors.email
                        ? 'border-red-500 focus-visible:ring-red-500'
                        : ''
                      }`
                    }
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-700"> Password </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    {...register('password')}
                    className={`pl-11 pr-12 bg-white border-slate-200 text-slate-800 placeholder:text-slate-400 focus-visible:ring-blue-500
                      ${ errors.password
                        ? 'border-red-500 focus-visible:ring-red-500'
                        : ''
                      }`
                    }
                  />
                  <Button
                    type="button"
                    size="icon"
                    onClick={togglePassword}
                    className="absolute right-1 top-1/2 -translate-y-1/2 bg-transparent text-slate-400 hover:text-slate-700 hover:bg-slate-100/70 focus-visible:ring-0 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-end">
                <Tooltip>
                  <TooltipTrigger asChild>
                      <Button variant="link" className="text-slate-800 p-0 h-auto cursor-pointer">Forgot password?</Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Contact Administrator</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              
              <Button
                type='submit'
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                <> Sign In </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="mt-8 text-center text-xs text-slate-500">
          © 2025 Nexora. All rights reserved.
        </p>
      </div>
    </div>
 );
};
