import { API_BASE } from './config'
import { parseResponse } from './http'

export async function login(email, password) {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })

  const data = await parseResponse(response)

  if (!response.ok) {
    throw new Error(data.message || 'Login failed')
  }

  return data
}
