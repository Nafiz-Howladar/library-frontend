import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 65000,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('library_access_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
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

export default api
