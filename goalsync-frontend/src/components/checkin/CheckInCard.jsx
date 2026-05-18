import StatusBadge from '../StatusBadge'
import ProgressBar from '../ProgressBar'
import CommentSection from './CommentSection'
import { CHECK_IN_STATUSES, formatAchievement } from '../../lib/checkInConstants'

const inputClass =
  'w-full rounded-lg border border-zinc-700 bg-zinc-950/80 px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50'

export default function CheckInCard({
  item,
  onUpdate,
  onAddComment,
  showComments = true,
  managerMode = false,
  accent = 'emerald',
}) {
  const barColor = accent === 'sky' ? 'bg-sky-500' : 'bg-emerald-500'
  const sliderAccent = accent === 'sky' ? 'accent-sky-500' : 'accent-emerald-500'

  return (
    <article className="rounded-xl border border-zinc-800 bg-zinc-950/50 overflow-hidden">
      <div className="px-5 py-4 border-b border-zinc-800 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-[10px] font-medium uppercase tracking-wide px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
              {item.thrustArea}
            </span>
            <span className="text-xs text-zinc-600">Updated {item.lastUpdated}</span>
          </div>
          <h3 className="font-semibold text-zinc-100">{item.goalTitle}</h3>
          {managerMode && (
            <p className="text-xs text-zinc-500 mt-0.5">{item.employeeName}</p>
          )}
        </div>
        <StatusBadge status={item.status} />
      </div>

      <div className="px-5 py-4 grid gap-5 sm:grid-cols-2">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-3">
              <p className="text-[10px] uppercase tracking-wide text-zinc-500 mb-1">Planned</p>
              <p className="text-sm font-semibold tabular-nums text-zinc-200">
                {formatAchievement(item.plannedTarget, item.uomType)}
              </p>
              <p className="text-[10px] text-zinc-600 mt-0.5">{item.uomType}</p>
            </div>
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-3">
              <p className="text-[10px] uppercase tracking-wide text-zinc-500 mb-1">Actual</p>
              {managerMode ? (
                <p className="text-sm font-semibold tabular-nums text-emerald-400">
                  {formatAchievement(item.actualAchievement, item.uomType)}
                </p>
              ) : (
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={item.actualAchievement}
                  onChange={(e) =>
                    onUpdate(item.id, { actualAchievement: Number(e.target.value) || 0 })
                  }
                  className={inputClass}
                />
              )}
            </div>
          </div>

          {!managerMode && (
            <label className="block">
              <span className="text-xs font-medium text-zinc-400">Status</span>
              <select
                value={item.status}
                onChange={(e) => onUpdate(item.id, { status: e.target.value })}
                className={`mt-1.5 ${inputClass}`}
              >
                {CHECK_IN_STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>

        <div className="space-y-3">
          <label className="block">
            <div className="flex justify-between text-xs mb-2">
              <span className="font-medium text-zinc-400">Progress</span>
              <span className="tabular-nums text-zinc-300">{item.progress}%</span>
            </div>
            {managerMode ? (
              <ProgressBar value={item.progress} color={barColor} />
            ) : (
              <>
                <ProgressBar value={item.progress} color={barColor} />
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={item.progress}
                  onChange={(e) => onUpdate(item.id, { progress: Number(e.target.value) })}
                  className={`w-full mt-2 h-1.5 ${sliderAccent} cursor-pointer`}
                  aria-label="Progress percentage"
                />
              </>
            )}
          </label>

          {managerMode && (
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/30 px-3 py-2">
              <p className="text-[10px] uppercase text-zinc-500">Variance</p>
              <p className="text-sm font-medium tabular-nums mt-0.5">
                {item.plannedTarget > 0
                  ? `${Math.round((item.actualAchievement / item.plannedTarget) * 100)}% of plan`
                  : '—'}
              </p>
            </div>
          )}
        </div>
      </div>

      {showComments && (
        <div className="px-5 py-4 border-t border-zinc-800 bg-zinc-900/20">
          <CommentSection
            comments={item.comments}
            onAddComment={
              managerMode && onAddComment ? (text) => onAddComment(item.id, text) : undefined
            }
            readOnly={!managerMode}
            accent={accent}
          />
        </div>
      )}
    </article>
  )
}
