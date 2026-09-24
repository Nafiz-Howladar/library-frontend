import { useCallback, useEffect, useState } from 'react'
import Loader from '../components/Loader.jsx'
import Toast from '../components/Toast.jsx'
import { getBooks, getIssues } from '../services/api.js'
import { getErrorMessage } from '../services/errors.js'
import { joinBookInfo, normalizeBook, normalizeIssue } from '../services/normalizers.js'

const valueOrNA = (value) => value == null || value === '' ? 'N/A' : value
const statusKey = (status) => String(status ?? '').toLowerCase()
const isOverdue = (issue) => {
  if (statusKey(issue.status) === 'returned' || issue.return_date || !issue.due_date) return false
  const due = new Date(issue.due_date).getTime()
  return Number.isFinite(due) && due < Date.now()
}

function MyBooksPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const loadItems = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const [issues, catalog] = await Promise.all([getIssues(), getBooks()])
      setItems(joinBookInfo(normalizeIssue(issues) ?? [], normalizeBook(catalog) ?? []))
    } catch (requestError) { setError(getErrorMessage(requestError)) }
    finally { setLoading(false) }
  }, [])
  useEffect(() => {
    let mounted = true
    Promise.all([getIssues(), getBooks()])
      .then(([issues, catalog]) => {
        if (mounted) setItems(joinBookInfo(normalizeIssue(issues) ?? [], normalizeBook(catalog) ?? []))
      })
      .catch((requestError) => { if (mounted) setError(getErrorMessage(requestError)) })
      .finally(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
  }, [])

  const borrowed = items.filter((item) => statusKey(item.status) === 'issued')
  const returned = items.filter((item) => statusKey(item.status) === 'returned')
  const renderIssue = (item) => <article className="record-card issue-card" key={item.id}>
    <div className="record-main"><p className="record-title">{valueOrNA(item.title)}</p><p className="record-subtitle">{valueOrNA(item.author)}</p></div>
    <dl className="record-facts"><div><dt>Issue date</dt><dd>{valueOrNA(item.issue_date)}</dd></div><div><dt>Due date</dt><dd>{valueOrNA(item.due_date)}</dd></div><div><dt>Fine amount</dt><dd>{item.fine_amount == null ? 'N/A' : `${item.fine_amount} ৳`}</dd></div><div><dt>Fine status</dt><dd>{item.fine_paid === true ? 'Paid' : item.fine_paid === false ? 'Unpaid' : 'N/A'}</dd></div></dl>
    {isOverdue(item) && <span className="overdue-badge">Overdue</span>}
  </article>

  return (
    <div className="page-shell account-shell">
      <header className="account-heading"><p className="section-kicker">YOUR ACCOUNT</p><h1>My books</h1><p>Books currently associated with your account.</p></header>
      {loading ? <Loader /> : error ? <><Toast kind="error">{error}</Toast><button className="button button-primary" type="button" onClick={loadItems}>Try again</button></> : items.length === 0 ? <div className="status-panel"><h2>No issued books</h2><p>Your books will show up here when available.</p></div> : <div className="my-books-sections">
        <section aria-labelledby="borrowed-heading"><div className="subsection-heading"><h2 id="borrowed-heading">Currently borrowed</h2><span className="book-count">{borrowed.length}</span></div>{borrowed.length ? <div className="record-list">{borrowed.map(renderIssue)}</div> : <p className="account-empty">No books are currently borrowed.</p>}</section>
        <section aria-labelledby="returned-heading"><div className="subsection-heading"><h2 id="returned-heading">Returned</h2><span className="book-count">{returned.length}</span></div>{returned.length ? <div className="record-list">{returned.map(renderIssue)}</div> : <p className="account-empty">No returned books yet.</p>}</section>
      </div>}
    </div>
  )
}

export default MyBooksPage
