import { Link } from 'react-router-dom'

function AdminReservationsPage() {
  return <div className="page-shell account-shell admin-shell"><Link className="back-link" to="/admin">← Admin dashboard</Link><header className="account-heading"><p className="section-kicker">LIBRARIAN WORKSPACE</p><h1>Reservations</h1></header><div className="status-panel"><span className="quiet-icon status-icon" aria-hidden="true">⌛</span><h2>Coming soon</h2><p>Reservation management will be available here in a future update.</p></div></div>
}

export default AdminReservationsPage
