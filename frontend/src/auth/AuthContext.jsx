import { createContext, useContext, useMemo, useState } from 'react'
import { api } from '../api/client.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('admin_token'))
  const [username, setUsername] = useState(() => localStorage.getItem('admin_username'))

  const value = useMemo(
    () => ({
      isAuthenticated: Boolean(token),
      username,
      async login(user, password) {
        const { data } = await api.post('/admin/auth/login', { username: user, password })
        localStorage.setItem('admin_token', data.token)
        localStorage.setItem('admin_username', data.username)
        setToken(data.token)
        setUsername(data.username)
        return data
      },
      logout() {
        localStorage.removeItem('admin_token')
        localStorage.removeItem('admin_username')
        setToken(null)
        setUsername(null)
      },
    }),
    [token, username],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return context
}
