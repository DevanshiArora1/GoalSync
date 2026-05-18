export default function StatCard({ label, value, hint, trend }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">{label}</p>
      <p className="mt-2 text-2xl font-bold tracking-tight text-zinc-50">{value}</p>
      {(hint || trend) && (
        <p className={`mt-1 text-xs ${trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-red-400' : 'text-zinc-500'}`}>
          {hint}
        </p>
      )}
    </div>
  )
}
