export default function ProgressBar({ value, color = 'bg-emerald-500' }) {
  const clamped = Math.min(100, Math.max(0, value))
  return (
    <div className="flex items-center gap-3 min-w-[120px]">
      <div className="flex-1 h-2 rounded-full bg-zinc-800 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${color}`}
          style={{ width: `${clamped}%` }}
        ></div>
      </div>
      <span className="text-sm font-medium tabular-nums text-zinc-300 w-10 text-right">{clamped}%</span>
    </div>
  )
}
