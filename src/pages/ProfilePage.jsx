import { useState } from 'react'
import Toast from '../components/Toast.jsx'
import { useAuth } from '../context/useAuth.js'
import { changePassword, editUser } from '../services/api.js'
import { getErrorMessage } from '../services/errors.js'

function ProfilePage() {
  const { user } = useAuth()
  const [email, setEmail] = useState(user?.sub ?? '')
  const [savedEmail, setSavedEmail] = useState(user?.sub ?? '')
  const [nameForm, setNameForm] = useState({ firstname: '', lastname: '' })
  const [profileSending, setProfileSending] = useState(false)
  const [profileError, setProfileError] = useState('')
  const [profileSuccess, setProfileSuccess] = useState('')
  const [emailChanged, setEmailChanged] = useState(false)
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [passwordSending, setPasswordSending] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState('')

  async function submitProfile(event) {
    event.preventDefault()
    setProfileError('')
    setProfileSuccess('')
    setEmailChanged(false)

    const changes = {}
    const firstname = nameForm.firstname.trim()
    const lastname = nameForm.lastname.trim()
    const nextEmail = email.trim()
    if (firstname && (firstname.length < 3 || firstname.length > 30)) {
      setProfileError('First name must be between 3 and 30 characters.')
      return
    }
    if (lastname && (lastname.length < 3 || lastname.length > 30)) {
      setProfileError('Last name must be between 3 and 30 characters.')
      return
    }
    if (firstname) changes.firstname = firstname
    if (lastname) changes.lastname = lastname
    if (nextEmail && nextEmail !== savedEmail) changes.email = nextEmail
    if (Object.keys(changes).length === 0) {
      setProfileError('Enter a changed field before saving.')
      return
    }

    setProfileSending(true)
    try {
      const response = await editUser(changes)
      const didChangeEmail = Object.hasOwn(changes, 'email')
      if (didChangeEmail) {
        setSavedEmail(nextEmail)
        setEmail(nextEmail)
      }
      setNameForm({ firstname: '', lastname: '' })
      setEmailChanged(didChangeEmail)
      setProfileSuccess(response.data?.message ?? 'Profile updated successfully.')
    } catch (error) {
      setProfileError(getErrorMessage(error))
    } finally {
      setProfileSending(false)
    }
  }

  function updatePassword(event) {
    setPasswordForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  async function submitPassword(event) {
    event.preventDefault()
    setPasswordError('')
    setPasswordSuccess('')
    if (passwordForm.newPassword.length < 8 || passwordForm.newPassword.length > 30) {
      setPasswordError('New password must be between 8 and 30 characters.')
      return
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New passwords do not match.')
      return
    }

    setPasswordSending(true)
    try {
      const response = await changePassword(passwordForm.currentPassword, passwordForm.newPassword)
      setPasswordSuccess(response.data?.message ?? 'Password updated successfully.')
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (error) {
      setPasswordError(error.response?.status === 401 ? 'Current password is incorrect' : getErrorMessage(error))
    } finally {
      setPasswordSending(false)
    }
  }

  return (
    <div className="page-shell account-shell profile-shell">
      <header className="account-heading"><p className="section-kicker">YOUR ACCOUNT</p><h1>Profile</h1><p>Manage your account details and password.</p></header>
      <div className="profile-forms-grid">
        <section className="profile-card" aria-labelledby="edit-profile-heading">
          <p className="section-kicker">ACCOUNT DETAILS</p>
          <h2 id="edit-profile-heading">Edit profile</h2>
          <p className="profile-helper">Enter only the fields you want to change</p>
          <p className="profile-id">Account ID <strong>{user?.id ?? 'N/A'}</strong></p>
          <Toast kind="error">{profileError}</Toast>
          <Toast>{profileSuccess}</Toast>
          {emailChanged && <p className="profile-email-note">Your new email is used the next time you log in.</p>}
          <form onSubmit={submitProfile}>
            <label className="form-label" htmlFor="profile-firstname">First name</label>
            <input className="form-input" id="profile-firstname" name="firstname" autoComplete="given-name" minLength="3" maxLength="30" value={nameForm.firstname} onChange={(event) => setNameForm((current) => ({ ...current, firstname: event.target.value }))} />
            <label className="form-label" htmlFor="profile-lastname">Last name</label>
            <input className="form-input" id="profile-lastname" name="lastname" autoComplete="family-name" minLength="3" maxLength="30" value={nameForm.lastname} onChange={(event) => setNameForm((current) => ({ ...current, lastname: event.target.value }))} />
            <label className="form-label" htmlFor="profile-email">Email</label>
            <input className="form-input" id="profile-email" name="email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} />
            <button className="button button-primary profile-submit" type="submit" disabled={profileSending}>{profileSending ? 'Saving…' : 'Save profile'}</button>
          </form>
        </section>

        <section className="profile-card" aria-labelledby="change-password-heading">
          <p className="section-kicker">SECURITY</p>
          <h2 id="change-password-heading">Change password</h2>
          <p className="profile-helper">Choose a password between 8 and 30 characters.</p>
          <Toast kind="error">{passwordError}</Toast>
          <Toast>{passwordSuccess}</Toast>
          <form onSubmit={submitPassword}>
            <label className="form-label" htmlFor="current-password">Current password</label>
            <input className="form-input" id="current-password" name="currentPassword" type="password" autoComplete="current-password" value={passwordForm.currentPassword} onChange={updatePassword} required />
            <label className="form-label" htmlFor="new-password">New password</label>
            <input className="form-input" id="new-password" name="newPassword" type="password" autoComplete="new-password" minLength="8" maxLength="30" value={passwordForm.newPassword} onChange={updatePassword} required />
            <label className="form-label" htmlFor="confirm-new-password">Confirm new password</label>
            <input className="form-input" id="confirm-new-password" name="confirmPassword" type="password" autoComplete="new-password" minLength="8" maxLength="30" value={passwordForm.confirmPassword} onChange={updatePassword} required />
            <button className="button button-primary profile-submit" type="submit" disabled={passwordSending}>{passwordSending ? 'Updating…' : 'Change password'}</button>
          </form>
        </section>
      </div>
    </div>
  )
}

export default ProfilePage
