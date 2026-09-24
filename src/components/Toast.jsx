function Toast({ children, kind = 'success' }) {
  if (!children) return null
  return <div className={`toast toast-${kind}`} role={kind === 'error' ? 'alert' : 'status'}>{children}</div>
}

export default Toast
