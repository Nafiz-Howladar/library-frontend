import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/useAuth.js'

function Navbar() {
  const { isAuthenticated, isAdmin, logout } = useAuth()
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <NavLink className="brand" to="/books" aria-label="Page & Pine home">
          <span className="brand-mark" aria-hidden="true">P</span>
          <span>Page &amp; Pine</span>
        </NavLink>
        <nav className={isAdmin ? 'nav-links nav-admin-links' : 'nav-links'} aria-label="Main navigation">
          <NavLink to="/books" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Books</NavLink>
          {isAuthenticated ? <>
            <NavLink to="/my-books" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>My Books</NavLink>
            <NavLink to="/reservations" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>My Reservations</NavLink>
            <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Dashboard</NavLink>
            {isAdmin && <>
              <NavLink to="/admin" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Admin</NavLink>
              <NavLink to="/admin/books" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Manage Books</NavLink>
              <NavLink to="/admin/issues" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Manage Issues</NavLink>
              <NavLink to="/admin/reservations" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Manage Reservations</NavLink>
            </>}
            <button className="nav-link nav-button" type="button" onClick={logout}>Logout</button>
          </> : <>
            <NavLink to="/login" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Login</NavLink>
            <NavLink to="/register" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Register</NavLink>
          </>}
        </nav>
      </div>
    </header>
  )
}

export default Navbar
