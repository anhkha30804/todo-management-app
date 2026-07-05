'use client'

import { createContext, useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { User } from '@/types/auth.types'

interface AuthContextType {
  user: User | null
  token: string | null
  loading: boolean
  login: (token: string, user: User) => void
  logout: () => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // 1. Load token and user from localStorage on mount
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')

    if (storedToken && storedUser) {
      setToken(storedToken)
      try {
        setUser(JSON.parse(storedUser))
      } catch (e) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    if (loading) return

    const isAuthRoute = pathname === '/login' || pathname === '/register'

    if (token) {
      // 2. If logged in, redirect away from auth routes to default dashboard
      if (isAuthRoute) {
        router.replace('/board')
      }
    } else {
      // 3. If not logged in, redirect to login unless already on auth routes
      if (!isAuthRoute) {
        router.replace('/login')
      }
    }
  }, [token, pathname, loading, router])

  const login = (newToken: string, newUser: User) => {
    localStorage.setItem('token', newToken)
    localStorage.setItem('user', JSON.stringify(newUser))
    setToken(newToken)
    setUser(newUser)
    router.replace('/board')
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
    router.replace('/login')
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
