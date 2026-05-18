const DEFAULT_API_URL = 'http://127.0.0.1:5000'

function normalizeOrigin(url) {
  return String(url).trim().replace(/\/$/, '')
}

export function getApiOrigin() {
  const fromEnv = import.meta.env.VITE_API_URL
  const origin = fromEnv && String(fromEnv).trim() ? fromEnv : DEFAULT_API_URL
  return normalizeOrigin(origin)
}

/** Base path for REST endpoints: `{origin}/api` */
export const API_BASE = `${getApiOrigin()}/api`
