import api from './api.js'
import { getErrorMessage } from './errors.js'

export async function getAdminBooks() {
  const response = await api.get('/book/all', { requiresAuth: true })
  return response.data
}

export async function createAdminBook(book) {
  return api.post('/admin/create_book', book, { requiresAuth: true })
}

export async function updateAdminBook(bookId, changes) {
  return api.put(`/admin/updatebook/${encodeURIComponent(bookId)}`, changes, { requiresAuth: true })
}

export async function deleteAdminBook(bookId) {
  return api.delete(`/admin/updatebook/${encodeURIComponent(bookId)}`, { requiresAuth: true })
}

export async function createIssue(bookId, userId) {
  return api.post('/admin/issue_create', { book_id: bookId, user_id: userId }, { requiresAuth: true })
}

export async function returnBook(issueId) {
  return api.put(`/admin/return_book/${encodeURIComponent(issueId)}`, undefined, { requiresAuth: true })
}

export async function markFinePaid(issueId) {
  return api.put(`/admin/fine_paid/${encodeURIComponent(issueId)}`, undefined, { requiresAuth: true })
}

export function getAdminErrorMessage(error) {
  const { status, data } = error?.response ?? {}
  const detail = typeof data?.detail === 'string' ? data.detail : null
  if (status === 404 && detail?.includes('Authentication')) return 'Not authorized (librarian only)'
  if (status === 404 && detail) return detail
  return getErrorMessage(error)
}

export function getAdminSuccessMessage(response) {
  return typeof response.data === 'string' ? response.data : JSON.stringify(response.data)
}
