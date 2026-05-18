import StatusBadge from '../StatusBadge'
import ProgressBar from '../ProgressBar'
import { formatAchievement } from '../../lib/checkInConstants'

export default function AchievementTrackingTable({ items, showEmployee = false, accent = 'emerald' }) {
  const barColor = accent === 'sky' ? 'bg-sky-500' : 'bg-emerald-500'

  if (items.length === 0) {
    return (
      <p className="px-5 py-12 text-center text-sm text-zinc-500">No check-in records for this quarter.</p>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-zinc-500 border-b border-zinc-800 bg-zinc-900/60">
            {showEmployee && <th className="px-5 py-3 font-medium">Employee</th>}
            <th className="px-5 py-3 font-medium">Goal</th>
            <th className="px-5 py-3 font-medium hidden md:table-cell">Planned</th>
            <th className="px-5 py-3 font-medium hidden md:table-cell">Actual</th>
            <th className="px-5 py-3 font-medium min-w-[140px]">Progress</th>
            <th className="px-5 py-3 font-medium">Status</th>
            <th className="px-5 py-3 font-medium hidden lg:table-cell">Comments</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800">
          {items.map((row) => (
            <tr key={row.id} className="hover:bg-zinc-800/30 transition">
              {showEmployee && (
                <td className="px-5 py-4 font-medium whitespace-nowrap">{row.employeeName}</td>
              )}
              <td className="px-5 py-4">
                <p className="font-medium text-zinc-200">{row.goalTitle}</p>
                <p className="text-xs text-zinc-500 mt-0.5">{row.thrustArea}</p>
              </td>
              <td className="px-5 py-4 tabular-nums text-zinc-400 hidden md:table-cell">
                {formatAchievement(row.plannedTarget, row.uomType)}
              </td>
              <td className="px-5 py-4 tabular-nums hidden md:table-cell">
                <span
                  className={
                    row.actualAchievement >= row.plannedTarget && row.plannedTarget > 0
                      ? 'text-emerald-400 font-medium'
                      : 'text-zinc-300'
                  }
                >
                  {formatAchievement(row.actualAchievement, row.uomType)}
                </span>
              </td>
              <td className="px-5 py-4">
                <ProgressBar value={row.progress} color={barColor} />
              </td>
              <td className="px-5 py-4">
                <StatusBadge status={row.status} />
              </td>
              <td className="px-5 py-4 text-zinc-500 hidden lg:table-cell tabular-nums">
                {row.comments.length}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
