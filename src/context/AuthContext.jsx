import { useCallback, useEffect, useMemo, useState } from 'react'
import { login as loginRequest } from '../services/auth.js'
import AuthContext from './authContextValue.js'
import { isAdmin as hasAdminRole } from '../config/roles.js'
import { decodeJwt } from '../utils/jwt.js'

const TOKEN_KEY = 'library_access_token'

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))

  useEffect(() => {
    function clearToken() { setToken(null) }
    window.addEventListener('auth:unauthorized', clearToken)
    return () => window.removeEventListener('auth:unauthorized', clearToken)
  }, [])

  const login = useCallback(async (email, password) => {
    const result = await loginRequest(email, password)
    localStorage.setItem(TOKEN_KEY, result.access_token)
    setToken(result.access_token)
    return result
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    setToken(null)
  }, [])

  const user = useMemo(() => token ? decodeJwt(token) : null, [token])
  // This role check only controls the UI; the backend enforces real permissions.
  const isAdmin = hasAdminRole(user?.role)
  const value = useMemo(() => ({ token, user, login, logout, isAuthenticated: Boolean(token), isAdmin }), [token, user, login, logout, isAdmin])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
