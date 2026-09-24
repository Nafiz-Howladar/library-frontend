export const ADMIN_ROLES = ['librarian']

export function isAdmin(role) {
  return ADMIN_ROLES.includes(role)
}
