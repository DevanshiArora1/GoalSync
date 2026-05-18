export const ROLE_HOME = {
  employee: '/employee',
  manager: '/manager',
  admin: '/admin',
}

export function getStoredUser() {
  try {
    const raw = localStorage.getItem('user')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function getStoredUserId() {
  const user = getStoredUser()
  if (!user) return null
  return user._id ?? user.id ?? null
}

export function getToken() {
  return localStorage.getItem('token')
}

export function getUserRole() {
  const user = getStoredUser()
  return user?.role ?? null
}

export function getRoleHomePath(role) {
  return ROLE_HOME[role] ?? '/'
}

export function isAuthenticated() {
  return Boolean(getToken() && getUserRole())
}

export function getAuthState(allowedRole) {
  const token = getToken()
  const user = getStoredUser()
  const role = user?.role ?? null

  if (!token || !role) {
    return { status: 'unauthenticated' }
  }

  if (allowedRole && role !== allowedRole) {
    return { status: 'wrong-role', role }
  }

  return { status: 'authorized', role }
}
