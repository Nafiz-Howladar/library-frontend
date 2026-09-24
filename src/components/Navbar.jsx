import { NavLink } from 'react-router-dom'

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <NavLink className="brand" to="/books" aria-label="Page & Pine home">
          <span className="brand-mark" aria-hidden="true">P</span>
          <span>Page &amp; Pine</span>
        </NavLink>
        <nav className="nav-links" aria-label="Main navigation">
          <NavLink to="/books" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Books</NavLink>
          <NavLink to="/login" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Login</NavLink>
        </nav>
      </div>
    </header>
  )
}

export default Navbar
