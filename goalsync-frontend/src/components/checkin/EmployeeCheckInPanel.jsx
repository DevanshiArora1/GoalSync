import { useMemo } from 'react'
import { useCheckIns } from '../../context/CheckInContext'
import { CURRENT_EMPLOYEE } from '../../lib/checkInConstants'
import QuarterlyTimeline from './QuarterlyTimeline'
import CheckInCard from './CheckInCard'
import AchievementTrackingTable from './AchievementTrackingTable'

export default function EmployeeCheckInPanel() {
  const { checkIns, activeQuarter, setActiveQuarter, updateCheckIn } = useCheckIns()

  const myCheckIns = useMemo(
    () => checkIns.filter((c) => c.employeeId === CURRENT_EMPLOYEE.id && c.quarter === activeQuarter),
    [checkIns, activeQuarter],
  )

  const avgProgress = useMemo(() => {
    if (myCheckIns.length === 0) return 0
    return Math.round(myCheckIns.reduce((s, c) => s + c.progress, 0) / myCheckIns.length)
  }, [myCheckIns])

  return (
    <section id="checkins" className="space-y-6 mb-8">
      <div>
        <h2 className="font-semibold text-lg">Quarterly check-in</h2>
        <p className="text-sm text-zinc-500 mt-1">
          Update achievement, progress, and status for {activeQuarter} · Avg. {avgProgress}% complete
        </p>
      </div>

      <QuarterlyTimeline
        activeQuarter={activeQuarter}
        onQuarterChange={setActiveQuarter}
        accent="emerald"
      />

      {myCheckIns.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-700 bg-zinc-900/20 px-6 py-12 text-center">
          <p className="text-sm text-zinc-400">No check-ins for {activeQuarter} yet.</p>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {myCheckIns.map((item) => (
            <CheckInCard
              key={item.id}
              item={item}
              onUpdate={updateCheckIn}
              showComments
              managerMode={false}
              accent="emerald"
            />
          ))}
        </div>
      )}

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 overflow-hidden shadow-xl shadow-black/10">
        <div className="px-5 py-4 border-b border-zinc-800">
          <h3 className="font-semibold">Achievement tracking</h3>
          <p className="text-xs text-zinc-500 mt-0.5">Planned vs actual summary</p>
        </div>
        <AchievementTrackingTable items={myCheckIns} accent="emerald" />
      </div>
    </section>
  )
}
