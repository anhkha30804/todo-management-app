'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { authService } from '@/services/auth.service'
import { toast } from 'sonner'
import { Lock, User, Loader2, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function LoginPage() {
   const [username, setUsername] = useState('')
   const [password, setPassword] = useState('')
   const [showPassword, setShowPassword] = useState(false)
   const [loading, setLoading] = useState(false)
   const { login } = useAuth()
   const router = useRouter()

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      if (!username.trim() || !password.trim()) {
         toast.error('Please fill in all fields')
         return
      }

      setLoading(true)
      try {
         const response = await authService.login({ username, password })
         toast.success('Welcome back!')
         login(response.data.accessToken, response.data.user)
      } catch (error: any) {
         if (error?.statusCode === 400 || error?.statusCode === 401) {
            toast.error('Invalid username or password')
         } else {
            toast.error('Something went wrong, please try again')
         }
      } finally {
         setLoading(false)
      }
   }

   return (
      <div className="relative min-h-screen flex items-center justify-center bg-slate-50 text-slate-900 overflow-hidden font-sans">
         {/* Decorative Blur Orbs */}
         <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-violet-500/5 blur-[120px] pointer-events-none" />
         <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />

         {/* Glassmorphic Light Card */}
         <div className="w-full max-w-md p-8 mx-4 rounded-3xl border border-slate-200/80 bg-white/70 backdrop-blur-xl shadow-2xl transition-all duration-300 hover:border-slate-300">
            <div className="text-center mb-8">
               <h2 className="text-3xl font-extrabold tracking-tight text-slate-950 mb-2 bg-gradient-to-r from-slate-950 via-slate-800 to-slate-600 bg-clip-text text-transparent animate-fade-in">
                  TodoBoard
               </h2>
               <p className="text-sm text-slate-500">Sign in to manage your tasks efficiently</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
               {/* Username Input */}
               <div className="space-y-2">
                  <Label
                     htmlFor="username"
                     className="text-xs font-semibold uppercase tracking-wider text-slate-500"
                  >
                     Username
                  </Label>
                  <div className="relative group">
                     <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 group-focus-within:text-violet-600 transition-colors z-10">
                        <User size={18} />
                     </span>
                     <Input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter username"
                        disabled={loading}
                        className="w-full pl-10 pr-4 h-11 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus-visible:border-violet-500/50 focus-visible:bg-white focus-visible:ring-0 transition-all"
                     />
                  </div>
               </div>

               {/* Password Input */}
               <div className="space-y-2">
                  <Label
                     htmlFor="password"
                     className="text-xs font-semibold uppercase tracking-wider text-slate-500"
                  >
                     Password
                  </Label>
                  <div className="relative group">
                     <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 group-focus-within:text-violet-600 transition-colors z-10">
                        <Lock size={18} />
                     </span>
                     <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        disabled={loading}
                        className="w-full pl-10 pr-10 h-11 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus-visible:border-violet-500/50 focus-visible:bg-white focus-visible:ring-0 transition-all"
                     />
                     <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={loading}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none z-20 cursor-pointer disabled:pointer-events-none"
                     >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                     </button>
                  </div>
               </div>

               {/* Submit Button */}
               <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 hover:bg-gradient-to-r active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer transition-all shadow-lg shadow-indigo-600/25 border-none"
               >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : 'Sign In'}
               </Button>
            </form>

            {/* Footnote links */}
            <div className="mt-8 text-center">
               <p className="text-sm text-slate-500">
                  Don't have an account?{' '}
                  <Link
                     href="/register"
                     className="font-medium text-violet-600 hover:text-violet-500 transition-colors"
                  >
                     Register now
                  </Link>
               </p>
            </div>
         </div>
      </div>
   )
}
