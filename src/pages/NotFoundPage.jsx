import { Link } from 'react-router-dom'

function NotFoundPage() {
  return <div className="status-panel not-found"><span className="section-kicker">404 · PAGE NOT FOUND</span><h1>Looks like a<br /><em>missing chapter.</em></h1><p>That page isn’t on our shelves.</p><Link className="button button-primary" to="/books">Back to books</Link></div>
}

export default NotFoundPage
