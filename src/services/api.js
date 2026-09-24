import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 65000,
})

function shouldDebug(config) {
  if (!import.meta.env.DEV || !config || config.url?.includes('/User_Login')) return false
  if (config.headers?.Authorization) return false
  if (config.url?.includes('/create_user')) return false
  const data = typeof config.data === 'string' ? config.data : JSON.stringify(config.data ?? {})
  return !/(password|access_token|token)/i.test(data)
}

function debugResponse(config, status, body) {
  if (shouldDebug(config)) {
    console.debug(config.method?.toUpperCase(), config.url, status, body)
  }
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('library_access_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (response) => {
    debugResponse(response.config, response.status, response.data)
    return response
  },
  (error) => {
    debugResponse(error.config, error.response?.status ?? 'network error', error.response?.data ?? error.message)
    const authFailure404 = error.response?.status === 404 && error.config?.authFailure404 &&
      typeof error.response.data?.detail === 'string' && error.response.data.detail.toLowerCase().includes('authentication')
    if (error.response?.status === 401 && error.config?.preserveSessionOn401) {
      return Promise.reject(error)
    }
    if (error.response?.status === 401) {
      if ((error.config?.requiresAuth || error.config?.headers?.Authorization) && window.location.pathname !== '/login') {
        sessionStorage.setItem('library_return_to', `${window.location.pathname}${window.location.search}${window.location.hash}`)
      }
      localStorage.removeItem('library_access_token')
      window.dispatchEvent(new Event('auth:unauthorized'))
      if (window.location.pathname !== '/login') window.location.assign('/login')
    } else if (authFailure404) {
      if (window.location.pathname !== '/login') {
        sessionStorage.setItem('library_return_to', `${window.location.pathname}${window.location.search}${window.location.hash}`)
      }
      localStorage.removeItem('library_access_token')
      window.dispatchEvent(new Event('auth:unauthorized'))
      if (window.location.pathname !== '/login') window.location.assign('/login')
    }
    return Promise.reject(error)
  },
)

export async function getBooks() {
  const response = await api.get('/book/all')
  return response.data
}

export async function getBookById(id) {
  const response = await api.get(`/book/${encodeURIComponent(id)}`, { requiresAuth: true, authFailure404: true })
  return response.data
}

export async function createUser(user) {
  const response = await api.post('/create_user', user)
  return response
}

export async function reserveBook(bookId) {
  const response = await api.post(`/reserve/${encodeURIComponent(bookId)}`, undefined, { requiresAuth: true, authFailure404: true })
  return response.data
}

export async function getReservations() {
  const response = await api.get('/reserve/all', { requiresAuth: true, authFailure404: true })
  return response.data
}

export async function cancelReservation(reservationId) {
  const response = await api.delete(`/reserve/cancel/${encodeURIComponent(reservationId)}`, { requiresAuth: true, authFailure404: true })
  return response.data
}

export async function getIssues() {
  const response = await api.get('/reserve/issue', { requiresAuth: true, authFailure404: true })
  return response.data
}

export async function editUser(changes) {
  return api.put('/edituser', changes, { requiresAuth: true })
}

export async function changePassword(currentPassword, newPassword) {
  return api.put('/passwordchange', {
    current_password: currentPassword,
    new_password: newPassword,
  }, { requiresAuth: true, preserveSessionOn401: true })
}

export default api
