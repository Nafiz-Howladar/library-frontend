import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/useAuth.js'

function Navbar() {
  const { isAuthenticated, logout } = useAuth()
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <NavLink className="brand" to="/books" aria-label="Page & Pine home">
          <span className="brand-mark" aria-hidden="true">P</span>
          <span>Page &amp; Pine</span>
        </NavLink>
        <nav className="nav-links" aria-label="Main navigation">
          <NavLink to="/books" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Books</NavLink>
          {isAuthenticated
            ? <button className="nav-link nav-button" type="button" onClick={logout}>Logout</button>
            : <NavLink to="/login" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Login</NavLink>}
        </nav>
      </div>
    </header>
  )
}

export default Navbar
