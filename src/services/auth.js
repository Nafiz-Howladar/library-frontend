import api from './api.js'

export async function login(email, password) {
  const body = new URLSearchParams({ username: email, password })
  const response = await api.post('/User_Login', body, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
  return response.data
}
