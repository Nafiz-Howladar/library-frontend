import { useCallback, useEffect, useMemo, useState } from 'react'
import { login as loginRequest } from '../services/auth.js'
import AuthContext from './authContextValue.js'

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

  const value = useMemo(() => ({ token, login, logout, isAuthenticated: Boolean(token) }), [token, login, logout])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
