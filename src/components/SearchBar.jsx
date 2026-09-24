function SearchBar({ search, onSearch, categories, category, onCategoryChange }) {
  return (
    <div className="filter-bar">
      <label className="search-field">
        <span className="sr-only">Search title or author</span>
        <span className="search-icon" aria-hidden="true">⌕</span>
        <input type="search" value={search} onChange={(event) => onSearch(event.target.value)} placeholder="Search by title or author" />
      </label>
      <label className="category-field">
        <span className="sr-only">Filter by category</span>
        <select value={category} onChange={(event) => onCategoryChange(event.target.value)}>
          <option value="">All categories</option>
          {categories.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
      </label>
    </div>
  )
}

export default SearchBar
