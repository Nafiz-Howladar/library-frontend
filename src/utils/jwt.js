export function decodeJwt(token) {
  try {
    const payload = token.split('.')[1]
    if (!payload) return null
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=')
    const bytes = atob(padded)
    const decoded = decodeURIComponent(Array.from(bytes, (character) => `%${character.charCodeAt(0).toString(16).padStart(2, '0')}`).join(''))
    const result = JSON.parse(decoded)
    return result && typeof result === 'object' ? result : null
  } catch {
    return null
  }
}
