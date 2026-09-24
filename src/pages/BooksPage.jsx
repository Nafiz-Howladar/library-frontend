import { useEffect, useMemo, useState } from 'react'
import BookCard from '../components/BookCard.jsx'
import EmptyState from '../components/EmptyState.jsx'
import ErrorState from '../components/ErrorState.jsx'
import Loader from '../components/Loader.jsx'
import SearchBar from '../components/SearchBar.jsx'
import { getBooks } from '../services/api.js'

function BooksPage() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')

  async function loadBooks() {
    setLoading(true)
    setError(false)
    try {
      const result = await getBooks()
      if (!Array.isArray(result)) throw new Error('Unexpected books response')
      setBooks(result)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let mounted = true
    getBooks()
      .then((result) => {
        if (!Array.isArray(result)) throw new Error('Unexpected books response')
        if (mounted) setBooks(result)
      })
      .catch(() => { if (mounted) setError(true) })
      .finally(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
  }, [])

  const categories = useMemo(() => [...new Set(books.map((book) => book.category).filter(Boolean))].sort((a, b) => a.localeCompare(b)), [books])
  const filteredBooks = useMemo(() => {
    const query = search.trim().toLocaleLowerCase()
    return books.filter((book) => {
      const matchesSearch = !query || `${book.title ?? ''} ${book.author ?? ''}`.toLocaleLowerCase().includes(query)
      return matchesSearch && (!category || book.category === category)
    })
  }, [books, category, search])

  return (
    <div className="page-shell">
      <section className="page-intro">
        <div className="eyebrow"><span className="eyebrow-rule" /> YOUR NEXT CHAPTER STARTS HERE</div>
        <h1>Find your next<br /><em>favorite read.</em></h1>
        <p>Browse the shelves and discover a book worth getting lost in.</p>
      </section>
      <section className="collection" aria-labelledby="collection-heading">
        <div className="collection-heading">
          <div><p className="section-kicker">A LITTLE SOMETHING FOR EVERYONE</p><h2 id="collection-heading">The collection</h2></div>
          {!loading && !error && <span className="book-count">{filteredBooks.length} {filteredBooks.length === 1 ? 'book' : 'books'}</span>}
        </div>
        <SearchBar search={search} onSearch={setSearch} categories={categories} category={category} onCategoryChange={setCategory} />
        {loading ? <Loader /> : error ? <ErrorState onRetry={loadBooks} /> : filteredBooks.length === 0 ? <EmptyState filtered={books.length > 0} /> : <div className="book-grid">{filteredBooks.map((book) => <BookCard key={book.id} book={book} />)}</div>}
      </section>
    </div>
  )
}

export default BooksPage
