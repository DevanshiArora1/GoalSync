import StatusBadge from '../StatusBadge'
import ProgressBar from '../ProgressBar'
import { getGoalStatus } from '../../lib/goalValidation'

function formatTarget(goal) {
  const { target, uomType } = goal
  if (uomType === 'Percentage') return `${target}%`
  if (uomType === 'Currency (INR)') return `₹${target.toLocaleString('en-IN')}`
  if (uomType === 'Rating (1-5)') return `${target} / 5`
  return target.toLocaleString('en-IN')
}

export default function GoalsTable({
  goals,
  loading = false,
  error = null,
  onRetry,
  onEdit,
  onDelete,
  deletingId = null,
  onProgressChange,
}) {
  if (loading) {
    return (
      <div className="px-5 py-16 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-zinc-600 border-t-emerald-500" />
        <p className="text-zinc-400 text-sm mt-4">Loading goals…</p>
      </div>
    )
  }

  if (error && goals.length === 0) {
    return (
      <div className="px-5 py-16 text-center">
        <p className="text-red-400 text-sm">{error}</p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-4 text-xs font-semibold text-emerald-400 hover:underline"
          >
            Try again
          </button>
        )}
      </div>
    )
  }

  if (goals.length === 0) {
    return (
      <div className="px-5 py-16 text-center">
        <p className="text-zinc-400 text-sm">No goals yet. Add your first objective to get started.</p>
        <p className="text-zinc-600 text-xs mt-2">Up to 8 goals · 10% minimum each · 100% total weightage</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-zinc-500 border-b border-zinc-800 bg-zinc-900/60">
            <th className="px-5 py-3 font-medium">Thrust area</th>
            <th className="px-5 py-3 font-medium min-w-[180px]">Goal title</th>
            <th className="px-5 py-3 font-medium hidden lg:table-cell max-w-[200px]">Description</th>
            <th className="px-5 py-3 font-medium hidden md:table-cell">UOM</th>
            <th className="px-5 py-3 font-medium hidden sm:table-cell">Target</th>
            <th className="px-5 py-3 font-medium">Weight</th>
            <th className="px-5 py-3 font-medium min-w-[140px]">Progress</th>
            <th className="px-5 py-3 font-medium">Status</th>
            <th className="px-5 py-3 font-medium w-24" />
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800">
          {goals.map((goal) => (
            <tr key={goal.id} className="hover:bg-zinc-800/30 transition group">
              <td className="px-5 py-4">
                <span className="inline-flex rounded-md bg-zinc-800/80 px-2 py-0.5 text-xs font-medium text-zinc-300">
                  {goal.thrustArea}
                </span>
              </td>
              <td className="px-5 py-4 font-medium text-zinc-100">{goal.title}</td>
              <td className="px-5 py-4 text-zinc-500 hidden lg:table-cell max-w-[200px]">
                <p className="line-clamp-2" title={goal.description}>
                  {goal.description}
                </p>
              </td>
              <td className="px-5 py-4 text-zinc-400 hidden md:table-cell text-xs">{goal.uomType}</td>
              <td className="px-5 py-4 text-zinc-300 hidden sm:table-cell tabular-nums font-medium">
                {formatTarget(goal)}
              </td>
              <td className="px-5 py-4">
                <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400 tabular-nums">
                  {goal.weightage}%
                </span>
              </td>
              <td className="px-5 py-4">
                <div className="flex flex-col gap-2">
                  <ProgressBar value={goal.progress} />
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={goal.progress}
                    onChange={(e) => onProgressChange(goal.id, Number(e.target.value))}
                    className="w-full h-1 accent-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    aria-label={`Progress for ${goal.title}`}
                  />
                </div>
              </td>
              <td className="px-5 py-4">
                <StatusBadge status={getGoalStatus(goal.progress)} />
              </td>
              <td className="px-5 py-4">
                <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition">
                  <button
                    type="button"
                    onClick={() => onEdit(goal)}
                    className="rounded-md p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-emerald-400 transition"
                    title="Edit goal"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(goal.id)}
                    disabled={deletingId === goal.id}
                    className="rounded-md p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-red-400 transition disabled:opacity-40 disabled:cursor-not-allowed"
                    title="Delete goal"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
