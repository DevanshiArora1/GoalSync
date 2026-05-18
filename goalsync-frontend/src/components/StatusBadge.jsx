const styles = {
  'not-started': 'bg-zinc-500/15 text-zinc-400 ring-zinc-500/20',
  'on-track': 'bg-emerald-500/15 text-emerald-400 ring-emerald-500/20',
  'at-risk': 'bg-amber-500/15 text-amber-400 ring-amber-500/20',
  behind: 'bg-red-500/15 text-red-400 ring-red-500/20',
  pending: 'bg-sky-500/15 text-sky-400 ring-sky-500/20',
  completed: 'bg-violet-500/15 text-violet-400 ring-violet-500/20',
  draft: 'bg-zinc-500/15 text-zinc-400 ring-zinc-500/20',
}

const defaultLabels = {
  'not-started': 'Not Started',
  'on-track': 'On Track',
  behind: 'Behind',
  completed: 'Completed',
}

export default function StatusBadge({ status, label }) {
  const text = label ?? defaultLabels[status] ?? status.replace(/-/g, ' ')
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ring-1 ring-inset ${styles[status] ?? styles.draft}`}
    >
      {text}
    </span>
  )
}
