function Loader() {
  return (
    <div className="status-panel" role="status" aria-live="polite">
      <span className="spinner" aria-hidden="true" />
      <h2>Gathering your reading list</h2>
      <p>Server is waking up... (free tier can take up to 60s)</p>
    </div>
  )
}

export default Loader
