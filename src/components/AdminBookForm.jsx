import { useState } from 'react'

function AdminBookForm({ book, onClose, onSave, sending }) {
  const initial = {
    title: book?.title ?? '',
    author: book?.author ?? '',
    category: book?.category ?? '',
    description: book?.description ?? '',
    price: book?.price == null ? '' : String(book.price),
    total_copy: book?.total_copy == null ? '1' : String(book.total_copy),
    avalaible_copy: book?.avalaible_copy == null ? '' : String(book.avalaible_copy),
  }
  const [form, setForm] = useState(initial)
  const [error, setError] = useState('')

  function update(event) { setForm((current) => ({ ...current, [event.target.name]: event.target.value })) }

  function submit(event) {
    event.preventDefault()
    if (form.title.trim().length < 2 || form.title.trim().length > 100) return setError('Title must be between 2 and 100 characters.')
    if (form.author.trim().length < 2 || form.author.trim().length > 100) return setError('Author must be between 2 and 100 characters.')
    if (!Number.isInteger(Number(form.price)) || Number(form.price) <= 0) return setError('Price must be a whole number greater than 0.')
    if (form.total_copy !== '' && !Number.isInteger(Number(form.total_copy))) return setError('Total copies must be a whole number.')
    if (book && form.avalaible_copy !== '' && !Number.isInteger(Number(form.avalaible_copy))) return setError('Available copies must be a whole number.')

    const values = {
      title: form.title.trim(),
      author: form.author.trim(),
      category: form.category.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      total_copy: form.total_copy === '' ? 1 : Number(form.total_copy),
    }
    if (book && form.avalaible_copy !== '') values.avalaible_copy = Number(form.avalaible_copy)
    if (book) {
      const changed = Object.fromEntries(Object.entries(values).filter(([key, value]) => String(value) !== String(book[key] ?? (key === 'total_copy' ? 1 : ''))))
      if (form.avalaible_copy !== '' && Number(form.avalaible_copy) !== Number(book.avalaible_copy)) changed.avalaible_copy = Number(form.avalaible_copy)
      if (Object.keys(changed).length === 0) return setError('Make a change before saving.')
      onSave(changed)
    } else {
      onSave(values)
    }
  }

  return (
    <div className="modal-backdrop">
      <section className="admin-modal" role="dialog" aria-modal="true" aria-labelledby="book-form-title">
        <div className="modal-heading"><div><p className="section-kicker">CATALOG</p><h2 id="book-form-title">{book ? 'Edit book' : 'Add a book'}</h2></div><button className="modal-close" type="button" aria-label="Close form" onClick={onClose}>×</button></div>
        {error && <p className="admin-inline-error" role="alert">{error}</p>}
        <form className="admin-book-form" onSubmit={submit}>
          <label className="form-label" htmlFor="book-title">Title</label><input className="form-input" id="book-title" name="title" value={form.title} onChange={update} minLength="2" maxLength="100" required />
          <label className="form-label" htmlFor="book-author">Author</label><input className="form-input" id="book-author" name="author" value={form.author} onChange={update} minLength="2" maxLength="100" required />
          <div className="form-row"><div><label className="form-label" htmlFor="book-category">Category</label><input className="form-input" id="book-category" name="category" value={form.category} onChange={update} /></div><div><label className="form-label" htmlFor="book-price">Price</label><input className="form-input" id="book-price" name="price" type="number" min="1" step="1" value={form.price} onChange={update} required /></div></div>
          <div className="form-row"><div><label className="form-label" htmlFor="total-copy">Total copies</label><input className="form-input" id="total-copy" name="total_copy" type="number" step="1" value={form.total_copy} onChange={update} required /></div>{book && <div><label className="form-label" htmlFor="available-copy">Available copies</label><input className="form-input" id="available-copy" name="avalaible_copy" type="number" step="1" value={form.avalaible_copy} onChange={update} /></div>}</div>
          <label className="form-label" htmlFor="book-description">Description</label><textarea className="form-input admin-textarea" id="book-description" name="description" value={form.description} onChange={update} rows="4" />
          <div className="modal-actions"><button className="button button-secondary" type="button" onClick={onClose} disabled={sending}>Cancel</button><button className="button button-primary" type="submit" disabled={sending}>{sending ? 'Saving…' : book ? 'Save changes' : 'Add book'}</button></div>
        </form>
      </section>
    </div>
  )
}

export default AdminBookForm
