import { useCallback, useEffect, useMemo, useState } from 'react'
import AdminBookForm from '../components/AdminBookForm.jsx'
import Toast from '../components/Toast.jsx'
import { deleteAdminBook, createAdminBook, getAdminBooks, getAdminErrorMessage, getAdminSuccessMessage, updateAdminBook } from '../services/admin.js'

function AdminBooksPage() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [listError, setListError] = useState('')
  const [search, setSearch] = useState('')
  const [formBook, setFormBook] = useState(undefined)
  const [sending, setSending] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [toast, setToast] = useState({ text: '', kind: 'success' })

  const loadBooks = useCallback(async () => {
    setLoading(true)
    setListError('')
    try {
      const result = await getAdminBooks()
      if (!Array.isArray(result)) throw new Error('The books response was not a list.')
      setBooks(result)
    } catch (error) {
      setListError(getAdminErrorMessage(error))
    } finally { setLoading(false) }
  }, [])

  useEffect(() => {
    let mounted = true
    getAdminBooks()
      .then((result) => {
        if (!Array.isArray(result)) throw new Error('The books response was not a list.')
        if (mounted) setBooks(result)
      })
      .catch((error) => { if (mounted) setListError(getAdminErrorMessage(error)) })
      .finally(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
  }, [])

  const filteredBooks = useMemo(() => {
    const query = search.trim().toLocaleLowerCase()
    return books.filter((book) => `${book.title ?? ''} ${book.author ?? ''} ${book.category ?? ''}`.toLocaleLowerCase().includes(query))
  }, [books, search])

  async function saveBook(changes) {
    setSending(true)
    try {
      const response = formBook ? await updateAdminBook(formBook.id, changes) : await createAdminBook(changes)
      setToast({ text: getAdminSuccessMessage(response), kind: 'success' })
      setFormBook(undefined)
      await loadBooks()
    } catch (error) {
      setToast({ text: getAdminErrorMessage(error), kind: 'error' })
    } finally { setSending(false) }
  }

  async function removeBook(book) {
    if (!window.confirm(`Delete “${book.title ?? 'this book'}”? This action cannot be undone.`)) return
    setDeletingId(book.id)
    setToast({ text: '', kind: 'success' })
    try {
      const response = await deleteAdminBook(book.id)
      setToast({ text: getAdminSuccessMessage(response), kind: 'success' })
      await loadBooks()
    } catch (error) {
      setToast({ text: getAdminErrorMessage(error), kind: 'error' })
    } finally { setDeletingId(null) }
  }

  return (
    <div className="page-shell account-shell admin-shell">
      <header className="admin-page-heading"><div><p className="section-kicker">LIBRARIAN WORKSPACE</p><h1>Manage books</h1><p>Add, update, and remove catalog entries.</p></div><button className="button button-primary" type="button" onClick={() => setFormBook(null)} disabled={deletingId !== null}>+ Add Book</button></header>
      <Toast kind={toast.kind}>{toast.text}</Toast>
      <div className="admin-list-tools"><label className="search-field admin-search"><span className="sr-only">Search books</span><span className="search-icon" aria-hidden="true">⌕</span><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search title, author, or category" /></label><span className="book-count">{filteredBooks.length} {filteredBooks.length === 1 ? 'book' : 'books'}</span></div>
      {loading ? <div className="status-panel" role="status"><span className="spinner" aria-hidden="true" /><h2>Loading books</h2></div> : listError ? <div className="status-panel"><Toast kind="error">{listError}</Toast><button className="button button-primary" type="button" onClick={loadBooks}>Try again</button></div> : filteredBooks.length === 0 ? <div className="status-panel"><h2>{books.length ? 'No matching books' : 'No books yet'}</h2><p>{books.length ? 'Try a different search.' : 'Add the first book to the catalog.'}</p></div> : <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Book</th><th>Author</th><th>Category</th><th>Price</th><th>Copies</th><th>Actions</th></tr></thead><tbody>{filteredBooks.map((book) => <tr key={book.id}><td className="admin-book-name">{book.title ?? 'N/A'}</td><td>{book.author ?? 'N/A'}</td><td>{book.category || 'N/A'}</td><td>{book.price == null ? 'N/A' : `${book.price} ৳`}</td><td>{book.avalaible_copy ?? 'N/A'} / {book.total_copy ?? 'N/A'}</td><td><div className="table-actions"><button className="text-action" type="button" onClick={() => setFormBook(book)} disabled={deletingId !== null}>Edit</button><button className="text-action danger-action" type="button" onClick={() => removeBook(book)} disabled={deletingId !== null}>{deletingId === book.id ? 'Deleting…' : 'Delete'}</button></div></td></tr>)}</tbody></table></div>}
      {formBook !== undefined && <AdminBookForm book={formBook} sending={sending} onClose={() => { if (!sending) setFormBook(undefined) }} onSave={saveBook} />}
    </div>
  )
}

export default AdminBooksPage
