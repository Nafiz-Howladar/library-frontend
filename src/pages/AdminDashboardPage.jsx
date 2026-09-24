import { Link } from 'react-router-dom'
import { useAuth } from '../context/useAuth.js'

const adminLinks = [
  { to: '/admin/books', title: 'Manage books', copy: 'Add, edit, and remove books from the catalog.' },
  { to: '/admin/issues', title: 'Manage issues', copy: 'Issue books, mark returns, and record paid fines.' },
  { to: '/admin/reservations', title: 'Reservations', copy: 'Reservation management is coming soon.' },
]

function AdminDashboardPage() {
  const { user } = useAuth()
  return (
    <div className="page-shell account-shell admin-shell">
      <header className="account-heading"><p className="section-kicker">LIBRARIAN WORKSPACE</p><h1>Welcome{user?.name ? `, ${user.name}` : ''}.</h1><p>Choose an area to manage the library.</p></header>
      <div className="admin-link-grid">{adminLinks.map((item) => <Link className="admin-link-card" to={item.to} key={item.to}><span className="admin-link-arrow" aria-hidden="true">↗</span><h2>{item.title}</h2><p>{item.copy}</p></Link>)}</div>
    </div>
  )
}

export default AdminDashboardPage
