import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { getAuthState, getRoleHomePath } from '../lib/authStorage'

function AuthLoadingScreen() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-zinc-600 border-t-emerald-500" />
        <p className="mt-4 text-sm text-zinc-500">Loading…</p>
      </div>
    </div>
  )
}

export default function GuestRoute({ children }) {
  const [ready, setReady] = useState(false)
  const [auth, setAuth] = useState(() => getAuthState())

  useEffect(() => {
    setReady(false)
    setAuth(getAuthState())
    setReady(true)
  }, [])

  if (!ready) {
    return <AuthLoadingScreen />
  }

  if (auth.status === 'authorized') {
    return <Navigate to={getRoleHomePath(auth.role)} replace />
  }

  return children
}
