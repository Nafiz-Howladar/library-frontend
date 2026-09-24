function BookCard({ book }) {
  const unavailable = Number(book.avalaible_copy) === 0
  return (
    <article className="book-card">
      <div className="book-cover" aria-label={book.cover_image ? 'Book cover' : 'Cover image unavailable'}>
        {book.cover_image ? <img src={book.cover_image} alt={`Cover of ${book.title}`} /> : <div className="cover-placeholder"><span className="cover-sun" /><span className="cover-lines" /><span className="cover-label">PAGE<br />&amp; PINE</span></div>}
      </div>
      <div className="book-content">
        <div className="book-topline">
          <span className="book-category">{book.category || 'Uncategorized'}</span>
          {unavailable && <span className="unavailable-badge">Unavailable</span>}
        </div>
        <h2 className="book-title">{book.title}</h2>
        <p className="book-author">by {book.author}</p>
        <div className="book-meta">
          <span className="book-price">{new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(Number(book.price) || 0)} <span>৳</span></span>
          <span className={unavailable ? 'availability unavailable-text' : 'availability'}>{book.avalaible_copy} of {book.total_copy} available</span>
        </div>
      </div>
    </article>
  )
}

export default BookCard
