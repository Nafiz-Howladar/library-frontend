import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth.js'
import Toast from '../components/Toast.jsx'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

  async function handleSubmit(event) {
    event.preventDefault()
    setSending(true)
    setError('')
    try {
      await login(email, password)
      const savedReturnTo = sessionStorage.getItem('library_return_to')
      sessionStorage.removeItem('library_return_to')
      const returnTo = location.state?.returnTo ?? savedReturnTo
      navigate(typeof returnTo === 'string' && returnTo.startsWith('/') && !returnTo.startsWith('//') ? returnTo : '/books', { replace: true })
    } catch {
      setError('Login failed, check email and password')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="login-page">
      <section className="login-card">
        <span className="login-mark" aria-hidden="true">P</span>
        <p className="section-kicker">WELCOME BACK</p>
        <h1>Good to see you.</h1>
        <p className="login-copy">Sign in to your library account.</p>
        {location.state?.successMessage && <Toast>{location.state.successMessage}</Toast>}
        <form onSubmit={handleSubmit}>
          <label className="form-label" htmlFor="email">Email</label>
          <input className="form-input" id="email" name="email" type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} required />
          <label className="form-label" htmlFor="password">Password</label>
          <input className="form-input" id="password" name="password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          <button className="button button-primary login-submit" type="submit" disabled={!email.trim() || !password || sending}>{sending ? 'Signing in…' : 'Sign in'}</button>
        </form>
        <Toast kind="error">{error}</Toast>
      </section>
    </div>
  )
}

export default LoginPage
