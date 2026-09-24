import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Toast from '../components/Toast.jsx'
import { createUser } from '../services/api.js'
import { getErrorMessage } from '../services/errors.js'

function RegisterPage() {
  const [form, setForm] = useState({ firstname: '', lastname: '', email: '', password: '', confirmPassword: '' })
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [validationError, setValidationError] = useState('')
  const navigate = useNavigate()

  function update(event) { setForm((current) => ({ ...current, [event.target.name]: event.target.value })) }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setValidationError('')
    if (form.password !== form.confirmPassword) {
      setValidationError('Passwords do not match.')
      return
    }
    const role = import.meta.env.VITE_REGISTER_ROLE?.trim()
    if (!role) {
      setError('Developer setup required: set VITE_REGISTER_ROLE in .env before registering users.')
      return
    }
    setSending(true)
    try {
      const response = await createUser({ firstname: form.firstname.trim(), lastname: form.lastname.trim(), email: form.email.trim(), password: form.password, role, is_active: true })
      if (response.status !== 201) {
        setError('The server did not confirm account creation. Please try again.')
        return
      }
      navigate('/login', { replace: true, state: { successMessage: 'Account created successfully. You can now log in.' } })
    } catch (requestError) {
      setError(getErrorMessage(requestError))
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="login-page">
      <section className="login-card register-card">
        <span className="login-mark" aria-hidden="true">P</span>
        <p className="section-kicker">JOIN THE LIBRARY</p>
        <h1>Create your account.</h1>
        <p className="login-copy">A few details and you’re ready to explore.</p>
        <Toast kind="error">{error}</Toast>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div><label className="form-label" htmlFor="firstname">First name</label><input className="form-input" id="firstname" name="firstname" autoComplete="given-name" value={form.firstname} onChange={update} required /></div>
            <div><label className="form-label" htmlFor="lastname">Last name</label><input className="form-input" id="lastname" name="lastname" autoComplete="family-name" value={form.lastname} onChange={update} required /></div>
          </div>
          <label className="form-label" htmlFor="register-email">Email</label>
          <input className="form-input" id="register-email" name="email" type="email" autoComplete="email" value={form.email} onChange={update} required />
          <label className="form-label" htmlFor="register-password">Password</label>
          <input className="form-input" id="register-password" name="password" type="password" autoComplete="new-password" value={form.password} onChange={update} required />
          <label className="form-label" htmlFor="confirm-password">Confirm password</label>
          <input className="form-input" id="confirm-password" name="confirmPassword" type="password" autoComplete="new-password" value={form.confirmPassword} onChange={update} required />
          <Toast kind="error">{validationError}</Toast>
          <button className="button button-primary login-submit" type="submit" disabled={sending}>{sending ? 'Creating account…' : 'Create account'}</button>
        </form>
      </section>
    </div>
  )
}

export default RegisterPage
