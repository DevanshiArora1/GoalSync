import { useMemo, useState } from 'react'
import { useCheckIns } from '../../context/CheckInContext'
import QuarterlyTimeline from './QuarterlyTimeline'
import CheckInCard from './CheckInCard'
import AchievementTrackingTable from './AchievementTrackingTable'

export default function ManagerCheckInPanel() {
  const { checkIns, activeQuarter, setActiveQuarter, addComment } = useCheckIns()
  const [selectedEmployee, setSelectedEmployee] = useState('all')

  const quarterCheckIns = useMemo(
    () => checkIns.filter((c) => c.quarter === activeQuarter),
    [checkIns, activeQuarter],
  )

  const employees = useMemo(() => {
    const names = [...new Set(quarterCheckIns.map((c) => c.employeeName))]
    return names.sort()
  }, [quarterCheckIns])

  const filtered = useMemo(() => {
    if (selectedEmployee === 'all') return quarterCheckIns
    return quarterCheckIns.filter((c) => c.employeeName === selectedEmployee)
  }, [quarterCheckIns, selectedEmployee])

  const teamAvg = useMemo(() => {
    if (quarterCheckIns.length === 0) return 0
    return Math.round(
      quarterCheckIns.reduce((s, c) => s + c.progress, 0) / quarterCheckIns.length,
    )
  }, [quarterCheckIns])

  return (
    <section id="checkins" className="space-y-6 mb-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="font-semibold text-lg">Quarterly check-ins</h2>
          <p className="text-sm text-zinc-500 mt-1">
            Review planned vs actual · Team avg. {teamAvg}% · {activeQuarter}
          </p>
        </div>
        <label className="flex flex-col gap-1">
          <span className="text-xs font-medium text-zinc-500">Filter by employee</span>
          <select
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
            className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-sky-500/30 min-w-[180px]"
          >
            <option value="all">All team members</option>
            {employees.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <QuarterlyTimeline
        activeQuarter={activeQuarter}
        onQuarterChange={setActiveQuarter}
        accent="sky"
      />

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 overflow-hidden shadow-xl shadow-black/10">
        <div className="px-5 py-4 border-b border-zinc-800">
          <h3 className="font-semibold">Achievement tracking</h3>
          <p className="text-xs text-zinc-500 mt-0.5">Planned vs actual across direct reports</p>
        </div>
        <AchievementTrackingTable items={filtered} showEmployee accent="sky" />
      </div>

      <div>
        <h3 className="font-semibold text-sm text-zinc-400 uppercase tracking-wide mb-4">
          Check-in cards
        </h3>
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-700 px-6 py-12 text-center text-sm text-zinc-500">
            No check-ins match this filter.
          </div>
        ) : (
          <div className="grid gap-4 xl:grid-cols-2">
            {filtered.map((item) => (
              <CheckInCard
                key={item.id}
                item={item}
                managerMode
                showComments
                onAddComment={addComment}
                accent="sky"
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
