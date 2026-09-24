import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Loader from '../components/Loader.jsx'
import Toast from '../components/Toast.jsx'
import { getBooks, getIssues, getReservations } from '../services/api.js'
import { getErrorMessage } from '../services/errors.js'
import { joinBookInfo, normalizeBook, normalizeIssue, normalizeReservation } from '../services/normalizers.js'

const valueOrNA = (value) => value == null || value === '' ? 'N/A' : value
const statusKey = (status) => String(status ?? '').toLowerCase()
const newestFirst = (items) => [...items].sort((a, b) => Number(b.id) - Number(a.id))
const isOverdue = (issue) => {
  if (statusKey(issue.status) === 'returned' || issue.return_date || !issue.due_date) return false
  const due = new Date(issue.due_date).getTime()
  return Number.isFinite(due) && due < Date.now()
}

function makeDashboardData(reservations, issues, catalog) {
  const books = normalizeBook(catalog) ?? []
  return {
    reservations: newestFirst(joinBookInfo(normalizeReservation(reservations) ?? [], books)),
    issues: joinBookInfo(normalizeIssue(issues) ?? [], books),
  }
}

function DashboardPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const loadDashboard = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const [reservations, issues, catalog] = await Promise.all([getReservations(), getIssues(), getBooks()])
      setData(makeDashboardData(reservations, issues, catalog))
    } catch (requestError) { setError(getErrorMessage(requestError)) }
    finally { setLoading(false) }
  }, [])

  useEffect(() => {
    let mounted = true
    Promise.all([getReservations(), getIssues(), getBooks()])
      .then(([reservations, issues, catalog]) => {
        if (mounted) setData(makeDashboardData(reservations, issues, catalog))
      })
      .catch((requestError) => { if (mounted) setError(getErrorMessage(requestError)) })
      .finally(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
  }, [])

  const pendingCount = data?.reservations.filter((item) => statusKey(item.status) === 'pending').length ?? 0
  const borrowed = data?.issues.filter((item) => statusKey(item.status) === 'issued') ?? []
  const overdueCount = borrowed.filter(isOverdue).length
  const unpaidFine = data?.issues.reduce((total, item) => {
    if (item.fine_paid !== false || item.fine_amount == null) return total
    const amount = Number(item.fine_amount)
    return Number.isFinite(amount) ? total + amount : total
  }, 0) ?? 0

  return (
    <div className="page-shell account-shell">
      <header className="account-heading"><p className="section-kicker">YOUR ACCOUNT</p><h1>Your dashboard</h1><p>A quick look at your library activity.</p></header>
      {loading ? <Loader /> : error ? <><Toast kind="error">{error}</Toast><button className="button button-primary" type="button" onClick={loadDashboard}>Try again</button></> : <>
        <div className="summary-grid dashboard-summary">
          <Link className="summary-card" to="/reservations"><span>Pending reservations</span><strong>{pendingCount}</strong><small>View reservations →</small></Link>
          <Link className="summary-card" to="/my-books"><span>Currently borrowed</span><strong>{borrowed.length}</strong><small>View my books →</small></Link>
          <Link className="summary-card" to="/my-books"><span>Overdue</span><strong>{overdueCount}</strong><small>Review due dates →</small></Link>
          <Link className="summary-card" to="/my-books"><span>Total unpaid fine</span><strong>{unpaidFine} ৳</strong><small>View my books →</small></Link>
        </div>
        <div className="dashboard-recent"><section className="recent-panel"><div className="panel-heading"><h2>Recent reservations</h2><Link to="/reservations">See all</Link></div>{data.reservations.length ? data.reservations.slice(0, 3).map((item) => <div className="recent-row" key={item.id}><span>{valueOrNA(item.title)}</span><span className={`status-badge status-${statusKey(item.status) || 'unknown'}`}>{valueOrNA(item.status)}</span></div>) : <p className="muted-copy">No reservations yet.</p>}</section>
          <section className="recent-panel"><div className="panel-heading"><h2>Current and returned books</h2><Link to="/my-books">See all</Link></div>{data.issues.length ? [...data.issues].sort((a, b) => Number(b.id) - Number(a.id)).slice(0, 3).map((item) => <div className="recent-row" key={item.id}><span>{valueOrNA(item.title)}</span><span>{valueOrNA(item.status)}</span></div>) : <p className="muted-copy">No issue history yet.</p>}</section></div>
      </>}
    </div>
  )
}

export default DashboardPage
