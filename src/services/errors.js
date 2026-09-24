export function getErrorMessage(error) {
  if (!error?.response) {
    return error?.code === 'ECONNABORTED' || error?.message?.toLowerCase().includes('timeout')
      ? 'The request timed out. The server may be waking up; please try again.'
      : 'Could not reach the server. It may be waking up; please check your connection and try again.'
  }

  const { status, data } = error.response
  if (status === 401) return 'Please log in to continue.'
  if (status === 403) return 'You do not have permission to do that.'
  if (status === 404 && typeof data?.detail === 'string' && data.detail.toLowerCase().includes('authentication')) return 'Please log in to continue.'
  if (status === 404 && typeof data?.detail === 'string') return data.detail
  if (status === 404) return 'The requested item could not be found.'
  if (status === 422) {
    const details = Array.isArray(data?.detail) ? data.detail.map((item) => item?.msg).filter(Boolean) : []
    return details.length ? details.join(' · ') : 'Some submitted information is not valid.'
  }
  if (typeof data === 'string' && data.trim()) return data
  if (typeof data?.detail === 'string') return data.detail
  if (status >= 500) return 'The server could not complete the request. Please try again.'
  return 'Something went wrong. Please try again.'
}
