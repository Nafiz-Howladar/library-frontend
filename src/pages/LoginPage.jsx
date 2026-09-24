import { useState } from 'react'

function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  function handleSubmit(event) { event.preventDefault() }

  return (
    <div className="login-page">
      <section className="login-card">
        <span className="login-mark" aria-hidden="true">P</span>
        <p className="section-kicker">WELCOME BACK</p>
        <h1>Good to see you.</h1>
        <p className="login-copy">Sign in to your library account.</p>
        <form onSubmit={handleSubmit}>
          <label className="form-label" htmlFor="username">Username</label>
          <input className="form-input" id="username" name="username" autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} required />
          <label className="form-label" htmlFor="password">Password</label>
          <input className="form-input" id="password" name="password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          <button className="button button-primary login-submit" type="submit" disabled={!username.trim() || !password}>Sign in</button>
        </form>
        <p className="login-note">Login is not connected yet</p>
      </section>
    </div>
  )
}

export default LoginPage
