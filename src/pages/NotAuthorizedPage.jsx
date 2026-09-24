import { Link } from 'react-router-dom'

function NotAuthorizedPage() {
  return <div className="status-panel not-found"><span className="status-icon" aria-hidden="true">!</span><h2>Not authorized</h2><p>This area is available to librarians only.</p><Link className="button button-primary" to="/books">Back to books</Link></div>
}

export default NotAuthorizedPage
