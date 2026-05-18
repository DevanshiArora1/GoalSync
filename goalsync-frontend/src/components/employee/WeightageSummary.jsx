import {
  MAX_GOALS,
  MIN_WEIGHTAGE,
  TARGET_TOTAL_WEIGHTAGE,
  isWeightageBalanced,
  getTotalWeightage,
} from '../../lib/goalValidation'

export default function WeightageSummary({ goals }) {
  const total = getTotalWeightage(goals)
  const balanced = isWeightageBalanced(goals)
  const remaining = TARGET_TOTAL_WEIGHTAGE - total
  const pct = Math.min(100, total)

  return (
    <div className="px-5 py-4 border-b border-zinc-800 bg-gradient-to-r from-zinc-900/80 to-zinc-900/40">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Weightage allocation</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className={`text-2xl font-bold tabular-nums ${balanced ? 'text-emerald-400' : 'text-zinc-100'}`}>
              {total}%
            </span>
            <span className="text-sm text-zinc-500">/ {TARGET_TOTAL_WEIGHTAGE}%</span>
            {balanced && (
              <span className="ml-2 inline-flex items-center rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-medium text-emerald-400 ring-1 ring-emerald-500/20">
                Balanced
              </span>
            )}
            {!balanced && goals.length > 0 && (
              <span className="ml-2 inline-flex items-center rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-medium text-amber-400 ring-1 ring-amber-500/20">
                {remaining > 0 ? `${remaining}% remaining` : `${Math.abs(remaining)}% over`}
              </span>
            )}
          </div>
          <p className="text-xs text-zinc-600 mt-1">
            {goals.length} / {MAX_GOALS} goals · min {MIN_WEIGHTAGE}% each
          </p>
        </div>
        <div className="flex-1 max-w-xs sm:max-w-sm">
          <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                balanced ? 'bg-emerald-500' : total > TARGET_TOTAL_WEIGHTAGE ? 'bg-red-500' : 'bg-amber-500'
              }`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
