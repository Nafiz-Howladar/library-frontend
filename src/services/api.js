import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 65000,
})

export async function getBooks() {
  const response = await api.get('/book/all')
  return response.data
}
