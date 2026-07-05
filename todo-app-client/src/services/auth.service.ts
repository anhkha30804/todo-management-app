import { http } from '@/lib/api'
import { AuthResponse } from '@/types/auth.types'

export const authService = {
  login: (body: unknown) => http.post<AuthResponse>('/auth/login', body),
  register: (body: unknown) => http.post<AuthResponse>('/auth/register', body)
}
