import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { getRoleHomePath } from '../lib/authStorage'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')


  const handleSubmit = async (e) => {
    e.preventDefault()
  
    try {
      const response = await fetch('http://127.0.0.1:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })
  
      const text = await response.text()
  
      console.log(text)
  
      let data
  
      try {
        data = JSON.parse(text)
      } catch {
        alert('Backend did not return JSON')
        return
      }
  
      if (!response.ok) {
        alert(data.message)
        return
      }
  
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
  
      const from = location.state?.from
      const home = getRoleHomePath(data.user.role)
      navigate(from && from === home ? from : home, { replace: true })
    } catch (error) {
      console.log(error)
      alert(error.message)
    }
  }
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden border-r border-zinc-800">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 via-zinc-950 to-violet-600/10" />
        <div className="relative z-10 flex flex-col justify-between p-12">
          <div>
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600 text-sm font-bold">
              GS
            </span>
            <h1 className="mt-8 text-4xl font-bold tracking-tight max-w-md">
              GoalSync
            </h1>
            <p className="mt-4 text-zinc-400 max-w-sm leading-relaxed">
              Corporate goal setting and tracking for high-performing teams. Align objectives, measure progress, and drive outcomes.
            </p>
          </div>
          <p className="text-sm text-zinc-500">© 2026 GoalSync · HR & Performance</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-12 sm:px-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 text-center">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600 text-sm font-bold">
              GS
            </span>
            <h2 className="mt-3 text-2xl font-bold">GoalSync</h2>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 shadow-2xl">
            <h2 className="text-xl font-semibold">Sign in to your portal</h2>
            <p className="mt-1 text-sm text-zinc-500">Use your work email and select your role.</p>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              <label className="block">
                <span className="text-xs font-medium text-zinc-400 uppercase tracking-wide">Email</span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="mt-1.5 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                />
              </label>

              <label className="block">
                <span className="text-xs font-medium text-zinc-400 uppercase tracking-wide">Password</span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="mt-1.5 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                />
              </label>

              

              <button
                type="submit"
                className="w-full rounded-lg bg-emerald-600 py-2.5 text-sm font-semibold hover:bg-emerald-500 transition shadow-lg shadow-emerald-900/30"
              >
                Sign in
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
