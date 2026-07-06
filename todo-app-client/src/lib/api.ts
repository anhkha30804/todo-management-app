const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api'

async function api<T>(path: string, options?: RequestInit): Promise<T> {
   const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
   const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options?.headers as any)
   }

   if (token) {
      headers['Authorization'] = `Bearer ${token}`
   }

   const res = await fetch(`${BASE_URL}${path}`, {
      headers,
      ...options
   })

   // 1. Intercept 401 Unauthorized errors (expired token) and clear the session
   if (res.status === 401 && path !== '/auth/login' && path !== '/auth/register') {
      if (typeof window !== 'undefined') {
         localStorage.removeItem('token')
         localStorage.removeItem('user')
         window.location.href = '/login'
      }
   }

   const text = await res.text()
   let json: any = null
   try {
      if (text) {
         json = JSON.parse(text)
      }
   } catch (err) {
      // Handle parsing error in case body exists but is not JSON
   }

   if (!res.ok) {
      const errorObj = typeof json === 'object' && json !== null ? json : { message: res.statusText }
      errorObj.statusCode = res.status
      throw errorObj
   }

   return json as T
}

export const http = {
   get: <T>(path: string) => api<T>(path),
   post: <T>(path: string, body: unknown) =>
      api<T>(path, { method: 'POST', body: JSON.stringify(body) }),
   patch: <T>(path: string, body: unknown) =>
      api<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),
   delete: <T>(path: string) => api<T>(path, { method: 'DELETE' })
}
