import { QUARTERS } from '../../lib/checkInConstants'

export default function QuarterlyTimeline({ activeQuarter, onQuarterChange, accent = 'emerald' }) {
  const activeBorder = accent === 'sky' ? 'border-sky-500/40' : 'border-emerald-500/40'
  const ringActive = accent === 'sky' ? 'ring-sky-500/50 bg-sky-500/15' : 'ring-emerald-500/50 bg-emerald-500/15'
  const dotActive = accent === 'sky' ? 'bg-sky-500' : 'bg-emerald-500'
  const textActive = accent === 'sky' ? 'text-sky-400' : 'text-emerald-400'

  return (
    <div className="relative">
      <div className="absolute left-0 right-0 top-5 hidden sm:block h-0.5 bg-zinc-800" aria-hidden />
      <ol className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 relative">
        {QUARTERS.map((q, index) => {
          const isActive = q.id === activeQuarter
          const isPast = q.status === 'completed'
          return (
            <li key={q.id}>
              <button
                type="button"
                onClick={() => onQuarterChange(q.id)}
                className={`w-full rounded-xl border p-4 text-left transition-all ${
                  isActive
                    ? `${activeBorder} ${ringActive} ring-2`
                    : 'border-zinc-800 bg-zinc-950/50 hover:border-zinc-700 hover:bg-zinc-900/60'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`flex h-2.5 w-2.5 rounded-full shrink-0 ${
                      isActive ? dotActive : isPast ? 'bg-violet-500' : 'bg-zinc-600'
                    }`}
                  />
                  <span className={`text-sm font-semibold ${isActive ? textActive : 'text-zinc-200'}`}>
                    {q.id}
                  </span>
                  {q.status === 'active' && !isActive && (
                    <span className="text-[10px] uppercase tracking-wide text-zinc-500">Current</span>
                  )}
                </div>
                <p className="text-xs text-zinc-500">{q.period}</p>
                {index < QUARTERS.length - 1 && (
                  <span className="sr-only">Step {index + 1} of {QUARTERS.length}</span>
                )}
              </button>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
