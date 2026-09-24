import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Loader from '../components/Loader.jsx'
import Toast from '../components/Toast.jsx'
import { useAuth } from '../context/useAuth.js'
import { getErrorMessage } from '../services/errors.js'
import { getBookById, reserveBook } from '../services/api.js'
import { normalizeBook } from '../services/normalizers.js'

function BookDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [book, setBook] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [reserveError, setReserveError] = useState('')
  const [sending, setSending] = useState(false)

  async function loadBook() {
    setLoading(true)
    setError('')
    try {
      const result = normalizeBook(await getBookById(id))
      setBook(Array.isArray(result) ? result[0] ?? null : result)
    } catch (requestError) {
      setError(getErrorMessage(requestError))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let mounted = true
    getBookById(id)
      .then((result) => {
        const normalized = normalizeBook(result)
        if (mounted) setBook(Array.isArray(normalized) ? normalized[0] ?? null : normalized)
      })
      .catch((requestError) => { if (mounted) setError(getErrorMessage(requestError)) })
      .finally(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
  }, [id])

  async function handleReserve() {
    setSending(true)
    setReserveError('')
    setMessage('')
    try {
      const result = await reserveBook(id)
      setMessage(typeof result === 'string' ? result : 'Reservation request submitted successfully.')
    } catch (requestError) {
      setReserveError(getErrorMessage(requestError))
    } finally {
      setSending(false)
    }
  }

  if (loading) return <div className="page-shell details-shell"><Loader /></div>
  if (error) return <div className="page-shell details-shell"><Toast kind="error">{error}</Toast><button className="button button-primary" type="button" onClick={loadBook}>Try again</button></div>
  if (!book) return <div className="page-shell details-shell"><p>Book not found.</p><Link className="button button-primary" to="/books">Back to books</Link></div>

  return (
    <div className="page-shell details-shell">
      <Link className="back-link" to="/books">← Back to books</Link>
      <Toast>{message}</Toast><Toast kind="error">{reserveError}</Toast>
      <article className="details-card">
        <div className="details-cover">{book.cover_image ? <img src={book.cover_image} alt={`Cover of ${book.title ?? 'book'}`} /> : <div className="cover-placeholder"><span className="cover-sun" /><span className="cover-lines" /><span className="cover-label">PAGE<br />&amp; PINE</span></div>}</div>
        <div className="details-copy">
          <p className="section-kicker">{book.category ?? 'N/A'}</p>
          <h1>{book.title ?? 'N/A'}</h1>
          <p className="details-author">by {book.author ?? 'N/A'}</p>
          <p className="details-description">{book.description ?? 'N/A'}</p>
          <dl className="details-facts">
            <div><dt>Price</dt><dd>{book.price == null ? 'N/A' : `${book.price} ৳`}</dd></div>
            <div><dt>Availability</dt><dd>{book.avalaible_copy ?? 'N/A'} of {book.total_copy ?? 'N/A'}</dd></div>
          </dl>
          {isAuthenticated
            ? <button className="button button-primary" type="button" onClick={handleReserve} disabled={sending}>{sending ? 'Sending…' : 'Reserve'}</button>
            : <button className="button button-primary" type="button" onClick={() => navigate('/login', { state: { returnTo: `/books/${id}` } })}>Log in to reserve</button>}
        </div>
      </article>
    </div>
  )
}

export default BookDetailsPage
