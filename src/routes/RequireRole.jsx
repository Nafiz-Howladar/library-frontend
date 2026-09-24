import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/useAuth.js'
import NotAuthorizedPage from '../pages/NotAuthorizedPage.jsx'

function RequireRole({ children }) {
  const { isAuthenticated, isAdmin } = useAuth()
  const location = useLocation()
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ returnTo: `${location.pathname}${location.search}${location.hash}` }} />
  }
  return isAdmin ? children : <NotAuthorizedPage />
}

export default RequireRole
