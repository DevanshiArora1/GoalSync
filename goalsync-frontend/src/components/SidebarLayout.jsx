import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const roleConfig = {
  employee: {
    label: 'Employee',
    accent: 'text-emerald-400',
    badge: 'bg-emerald-500/15 text-emerald-400',
    home: '/employee',
    user: { name: 'Alex Rivera', title: 'Product Analyst' },
    nav: [
      { label: 'Dashboard', href: '/employee#top', icon: '◉' },
      { label: 'My Goals', href: '/employee#goals', icon: '◎' },
      { label: 'Check-ins', href: '/employee#checkins', icon: '◫' },
    ],
  },
  manager: {
    label: 'Manager',
    accent: 'text-sky-400',
    badge: 'bg-sky-500/15 text-sky-400',
    home: '/manager',
    user: { name: 'Jordan Lee', title: 'Engineering Manager' },
    nav: [
      { label: 'Overview', href: '/manager#top', icon: '◉' },
      { label: 'Approvals', href: '/manager#approvals', icon: '✓' },
      { label: 'Team', href: '/manager#team', icon: '◎' },
      { label: 'Check-ins', href: '/manager#checkins', icon: '◫' },
    ],
  },
  admin: {
    label: 'Admin',
    accent: 'text-violet-400',
    badge: 'bg-violet-500/15 text-violet-400',
    home: '/admin',
    user: { name: 'Sam Patel', title: 'HR Operations' },
    nav: [
      { label: 'Analytics', href: '/admin#top', icon: '◉' },
      { label: 'Organization', href: '/admin#org', icon: '◎' },
      { label: 'Audit Logs', href: '/admin#audit', icon: '▤' },
      { label: 'Shared Goals', href: '/admin#shared', icon: '◇' },
    ],
  },
}

export default function SidebarLayout({ role, children }) {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const config = roleConfig[role]

  const isActive = (href) => {
    const path = href.split('#')[0]
    return location.pathname === path
  }

  return (
    <div className="h-screen overflow-hidden bg-zinc-950 text-zinc-100 flex">
      {open && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 flex flex-col border-r border-zinc-800 bg-zinc-900/95 backdrop-blur transform transition-transform duration-200 ${
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="px-5 py-5 border-b border-zinc-800">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-sm font-bold">
              GS
            </span>
            <span>
              <span className="block text-base font-semibold leading-tight">GoalSync</span>
              <span className="block text-xs text-zinc-500">Corporate portal</span>
            </span>
          </Link>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {config.nav.map((item) => (
  <button
    key={item.label}
    type="button"
    onClick={() => {
      setOpen(false)

      const [path, hash] = item.href.split('#')

      if (location.pathname !== path) {
        navigate(path)

        setTimeout(() => {
          if (hash) {
            const element = document.getElementById(hash)
            if (element) {
              element.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
              })
            }
          }
        }, 100)
      } else if (hash) {
        const element = document.getElementById(hash)

        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          })
        }
      }
    }}
    className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
      isActive(item.href)
        ? `bg-zinc-800 ${config.accent}`
        : 'text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-100'
    }`}
  >
    <span className="text-xs opacity-70">{item.icon}</span>
    {item.label}
  </button>
))}
        </nav>

        <div className="p-4 border-t border-zinc-800">
          <div className="rounded-lg bg-zinc-800/50 px-3 py-3">
            <p className="text-sm font-medium truncate">{config.user.name}</p>
            <p className="text-xs text-zinc-500 truncate">{config.user.title}</p>
            <span className={`mt-2 inline-block text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${config.badge}`}>
              {config.label}
            </span>
          </div>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="mt-3 w-full rounded-lg border border-zinc-700 py-2 text-xs font-medium text-zinc-400 hover:border-zinc-500 hover:text-zinc-200 transition"
          >
            Sign out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 flex items-center gap-4 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur px-4 sm:px-6 py-3 lg:px-8">
          <button
            type="button"
            className="lg:hidden rounded-lg border border-zinc-700 px-2.5 py-1.5 text-sm"
            onClick={() => setOpen(true)}
          >
            Menu
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-zinc-500 uppercase tracking-wide">{config.label} portal</p>
          </div>
          <span className="hidden sm:inline text-xs text-zinc-500">Q2 2026 cycle</span>
        </header>

        <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 lg:px-8 lg:py-8 lg:ml-64">
          {children}
        </main>
      </div>
    </div>
  )
}
