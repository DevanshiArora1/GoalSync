import { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { getAuthState, getRoleHomePath } from '../lib/authStorage'

function AuthLoadingScreen() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-zinc-600 border-t-emerald-500" />
        <p className="mt-4 text-sm text-zinc-500">Checking session…</p>
      </div>
    </div>
  )
}

export default function ProtectedRoute({ children, allowedRole }) {
  const location = useLocation()
  const [ready, setReady] = useState(false)
  const [auth, setAuth] = useState(() => getAuthState(allowedRole))

  useEffect(() => {
    setReady(false)
    const next = getAuthState(allowedRole)
    setAuth(next)
    setReady(true)
  }, [allowedRole, location.pathname])

  if (!ready) {
    return <AuthLoadingScreen />
  }

  if (auth.status === 'unauthenticated') {
    return <Navigate to="/" replace state={{ from: location.pathname }} />
  }

  if (auth.status === 'wrong-role') {
    return <Navigate to={getRoleHomePath(auth.role)} replace />
  }

  return children
}
