function ErrorState({ onRetry }) {
  return (
    <div className="status-panel error-panel" role="alert">
      <span className="status-icon" aria-hidden="true">!</span>
      <h2>We couldn’t load the books</h2>
      <p>Please check your connection and try again.</p>
      <button className="button button-primary" type="button" onClick={onRetry}>Try again</button>
    </div>
  )
}

export default ErrorState
