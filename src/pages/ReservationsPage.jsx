import { useCallback, useEffect, useState } from 'react'
import Loader from '../components/Loader.jsx'
import Toast from '../components/Toast.jsx'
import { cancelReservation, getBooks, getReservations } from '../services/api.js'
import { getErrorMessage } from '../services/errors.js'
import { joinBookInfo, normalizeBook, normalizeReservation } from '../services/normalizers.js'

const valueOrNA = (value) => value == null || value === '' ? 'N/A' : value
const statusKey = (status) => String(status ?? '').toLowerCase()
const newestFirst = (items) => [...items].sort((a, b) => Number(b.id) - Number(a.id))

function ReservationsPage() {
  const [items, setItems] = useState([])
  const [books, setBooks] = useState([])
  const [booksLoaded, setBooksLoaded] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [toast, setToast] = useState({ text: '', kind: 'success' })
  const [canceling, setCanceling] = useState(null)

  const loadItems = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const [reservations, catalog] = await Promise.all([getReservations(), booksLoaded ? Promise.resolve(books) : getBooks()])
      const normalizedBooks = booksLoaded ? catalog : normalizeBook(catalog) ?? []
      if (!booksLoaded) {
        setBooks(normalizedBooks)
        setBooksLoaded(true)
      }
      setItems(newestFirst(joinBookInfo(normalizeReservation(reservations) ?? [], normalizedBooks)))
    } catch (requestError) {
      setError(getErrorMessage(requestError))
    } finally { setLoading(false) }
  }, [books, booksLoaded])

  useEffect(() => {
    let mounted = true
    Promise.all([getReservations(), getBooks()])
      .then(([reservations, catalog]) => {
        if (mounted) {
          const normalizedBooks = normalizeBook(catalog) ?? []
          setBooks(normalizedBooks)
          setBooksLoaded(true)
          setItems(newestFirst(joinBookInfo(normalizeReservation(reservations) ?? [], normalizedBooks)))
        }
      })
      .catch((requestError) => { if (mounted) setError(getErrorMessage(requestError)) })
      .finally(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
  }, [])

  async function handleCancel(item) {
    if (item.id == null || statusKey(item.status) !== 'pending' || !window.confirm(`Cancel the reservation for “${item.title}”?`)) return
    setCanceling(item.id)
    setToast({ text: '', kind: 'success' })
    try {
      const result = await cancelReservation(item.id)
      setToast({ text: typeof result === 'string' ? result : 'Reservation canceled.', kind: 'success' })
      await loadItems()
    } catch (requestError) {
      setToast({ text: getErrorMessage(requestError), kind: 'error' })
    } finally { setCanceling(null) }
  }

  return (
    <div className="page-shell account-shell">
      <header className="account-heading"><p className="section-kicker">YOUR ACCOUNT</p><h1>My reservations</h1><p>Keep track of the books you have reserved.</p></header>
      <Toast kind={toast.kind}>{toast.text}</Toast>
      {loading ? <Loader /> : error ? <><Toast kind="error">{error}</Toast><button className="button button-primary" type="button" onClick={loadItems}>Try again</button></> : items.length === 0 ? <div className="status-panel"><h2>No reservations yet</h2><p>When you reserve a book, it will appear here.</p></div> : <div className="record-list">{items.map((item) => {
        const status = statusKey(item.status)
        const pending = status === 'pending'
        return <article className={`record-card ${status === 'cancelled' ? 'record-muted' : ''}`} key={item.id ?? `${item.book_id}-${item.user_id}`}>
          <div className="record-main"><p className="record-title">{valueOrNA(item.title)}</p><p className="record-subtitle">{valueOrNA(item.author)}</p></div>
          <dl className="record-facts"><div><dt>Status</dt><dd><span className={`status-badge status-${status || 'unknown'}`}>{valueOrNA(item.status)}</span></dd></div></dl>
          {pending && <button className="button button-secondary" type="button" onClick={() => handleCancel(item)} disabled={canceling !== null}>{canceling === item.id ? 'Canceling…' : 'Cancel'}</button>}
        </article>
      })}</div>}
    </div>
  )
}

export default ReservationsPage
