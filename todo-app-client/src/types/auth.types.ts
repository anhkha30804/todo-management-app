export interface User {
   id: string
   username: string
}

export interface AuthResponse {
   success: boolean
   message: string
   data: {
      user: User
      accessToken: string
   }
}
