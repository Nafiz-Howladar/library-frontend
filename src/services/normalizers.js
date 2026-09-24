function normalizeCollection(value, mapper) {
  if (Array.isArray(value)) return value.map(mapper)
  if (value && typeof value === 'object') return mapper(value)
  return null
}

export function normalizeBook(value) {
  return normalizeCollection(value, (book) => ({
    id: book.id ?? null,
    title: book.title ?? null,
    author: book.author ?? null,
    description: book.description ?? null,
    category: book.category ?? null,
    price: book.price ?? null,
    total_copy: book.total_copy ?? null,
    avalaible_copy: book.avalaible_copy ?? null,
    cover_image: book.cover_image ?? null,
    created_at: book.created_at ?? null,
    raw: book,
  }))
}

export function normalizeReservation(value) {
  return normalizeCollection(value, (reservation) => ({
    id: reservation.id ?? null,
    book_id: reservation.book_id ?? null,
    user_id: reservation.user_id ?? null,
    Reserve_date: reservation.Reserve_date ?? null,
    status: reservation.status ?? null,
    raw: reservation,
  }))
}

export function normalizeIssue(value) {
  return normalizeCollection(value, (issue) => ({
    id: issue.id ?? null,
    book_id: issue.book_id ?? null,
    user_id: issue.user_id ?? null,
    issue_date: issue.issue_date ?? null,
    due_date: issue.due_date ?? null,
    return_date: issue.return_date ?? null,
    status: issue.status ?? null,
    fine_amount: issue.fine_amount ?? null,
    fine_paid: issue.fine_paid ?? null,
    raw: issue,
  }))
}

export function joinBookInfo(records, books) {
  const bookById = new Map(books.map((book) => [String(book.id), book]))
  return records.map((record) => {
    const book = bookById.get(String(record.book_id))
    return {
      ...record,
      title: book?.title ?? `Book #${record.book_id}`,
      author: book?.author ?? 'N/A',
    }
  })
}
