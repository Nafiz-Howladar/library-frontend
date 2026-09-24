function EmptyState({ filtered = false }) {
  return (
    <div className="status-panel">
      <span className="status-icon quiet-icon" aria-hidden="true">⌕</span>
      <h2>{filtered ? 'No matching books' : 'The shelves are waiting'}</h2>
      <p>{filtered ? 'Try another title, author, or category.' : 'There are no books to show just yet.'}</p>
    </div>
  )
}

export default EmptyState
