import { useCallback, useEffect, useState } from 'react'
import Toast from '../components/Toast.jsx'
import { createIssue, getAdminBooks, getAdminErrorMessage, getAdminSuccessMessage, markFinePaid, returnBook } from '../services/admin.js'

function AdminIssuesPage() {
  const [books, setBooks] = useState([])
  const [booksLoading, setBooksLoading] = useState(true)
  const [booksError, setBooksError] = useState('')
  const [bookId, setBookId] = useState('')
  const [userId, setUserId] = useState('')
  const [returnId, setReturnId] = useState('')
  const [fineId, setFineId] = useState('')
  const [sending, setSending] = useState('')
  const [toast, setToast] = useState({ text: '', kind: 'success' })

  // TODO: Load user and issue selectors here when list endpoints are available.
  const loadBooks = useCallback(async () => {
    setBooksLoading(true)
    setBooksError('')
    try {
      const result = await getAdminBooks()
      if (!Array.isArray(result)) throw new Error('The books response was not a list.')
      setBooks(result)
      setBookId((current) => current || (result.length ? String(result[0].id) : ''))
    } catch (error) { setBooksError(getAdminErrorMessage(error)) }
    finally { setBooksLoading(false) }
  }, [])

  useEffect(() => {
    let mounted = true
    getAdminBooks()
      .then((result) => {
        if (!Array.isArray(result)) throw new Error('The books response was not a list.')
        if (mounted) {
          setBooks(result)
          if (result.length) setBookId(String(result[0].id))
        }
      })
      .catch((error) => { if (mounted) setBooksError(getAdminErrorMessage(error)) })
      .finally(() => { if (mounted) setBooksLoading(false) })
    return () => { mounted = false }
  }, [])

  async function perform(action, confirmMessage, request, reset) {
    if (!window.confirm(confirmMessage)) return
    setSending(action)
    setToast({ text: '', kind: 'success' })
    try {
      const response = await request()
      setToast({ text: getAdminSuccessMessage(response), kind: 'success' })
      reset?.()
    } catch (error) {
      setToast({ text: getAdminErrorMessage(error), kind: 'error' })
    } finally { setSending('') }
  }

  function submitIssue(event) {
    event.preventDefault()
    const numericBookId = Number(bookId)
    const numericUserId = Number(userId)
    if (!Number.isInteger(numericBookId) || !Number.isInteger(numericUserId) || numericUserId <= 0) {
      setToast({ text: 'Choose a book and enter a valid numeric user ID.', kind: 'error' })
      return
    }
    void perform('issue', 'Issue this book to the entered user ID?', () => createIssue(numericBookId, numericUserId), () => setUserId(''))
  }

  function submitIdAction(event, idValue, action, noun, request, reset) {
    event.preventDefault()
    const id = Number(idValue)
    if (!Number.isInteger(id) || id <= 0) {
      setToast({ text: `Enter a valid numeric ${noun} ID.`, kind: 'error' })
      return
    }
    void perform(action, `Confirm ${action === 'return' ? 'returning' : 'marking the fine paid for'} ${noun} #${id}?`, () => request(id), reset)
  }

  return (
    <div className="page-shell account-shell admin-shell">
      <header className="account-heading"><p className="section-kicker">LIBRARIAN WORKSPACE</p><h1>Manage issues</h1><p>Issue books, process returns, and record paid fines.</p></header>
      <Toast kind={toast.kind}>{toast.text}</Toast>
      <p className="admin-note">There is no endpoint to list issues or users yet, so enter their IDs manually.</p>
      <div className="admin-forms-grid">
          <section className="admin-action-card"><p className="section-kicker">CHECK OUT</p><h2>Issue a book</h2><form onSubmit={submitIssue}>
          <label className="form-label" htmlFor="issue-book">Book</label>{booksLoading ? <p className="muted-copy">Loading books…</p> : booksError ? <><Toast kind="error">{booksError}</Toast><button className="button button-secondary" type="button" onClick={loadBooks}>Retry book list</button></> : <select className="form-input" id="issue-book" value={bookId} onChange={(event) => setBookId(event.target.value)} disabled={!books.length} required><option value="" disabled>Select a book</option>{books.map((book) => <option value={book.id} key={book.id}>{book.title ?? 'N/A'} (#{book.id})</option>)}</select>}
          <label className="form-label" htmlFor="issue-user">User ID</label><input className="form-input" id="issue-user" type="number" min="1" step="1" value={userId} onChange={(event) => setUserId(event.target.value)} required />
          <button className="button button-primary admin-submit" type="submit" disabled={Boolean(sending) || booksLoading || Boolean(booksError) || !books.length}>{sending === 'issue' ? 'Issuing…' : 'Issue book'}</button>
        </form></section>
        <section className="admin-action-card"><p className="section-kicker">CHECK IN</p><h2>Return a book</h2><form onSubmit={(event) => submitIdAction(event, returnId, 'return', 'issue', returnBook, () => setReturnId(''))}>
          <label className="form-label" htmlFor="return-issue">Issue ID</label><input className="form-input" id="return-issue" type="number" min="1" step="1" value={returnId} onChange={(event) => setReturnId(event.target.value)} required />
          <button className="button button-primary admin-submit" type="submit" disabled={Boolean(sending)}>{sending === 'return' ? 'Returning…' : 'Mark returned'}</button>
        </form></section>
        <section className="admin-action-card"><p className="section-kicker">PAYMENTS</p><h2>Mark fine paid</h2><form onSubmit={(event) => submitIdAction(event, fineId, 'fine', 'issue', markFinePaid, () => setFineId(''))}>
          <label className="form-label" htmlFor="fine-issue">Issue ID</label><input className="form-input" id="fine-issue" type="number" min="1" step="1" value={fineId} onChange={(event) => setFineId(event.target.value)} required />
          <button className="button button-primary admin-submit" type="submit" disabled={Boolean(sending)}>{sending === 'fine' ? 'Updating…' : 'Mark fine paid'}</button>
        </form></section>
      </div>
    </div>
  )
}

export default AdminIssuesPage
