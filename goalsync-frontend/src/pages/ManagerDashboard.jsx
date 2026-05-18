import SidebarLayout from '../components/SidebarLayout'
import StatCard from '../components/StatCard'
import StatusBadge from '../components/StatusBadge'
import ProgressBar from '../components/ProgressBar'
import ManagerCheckInPanel from '../components/checkin/ManagerCheckInPanel'

const approvals = [
  { id: 1, employee: 'Alex Rivera', goal: 'Expand enterprise tier', submitted: 'May 12', status: 'pending' },
  { id: 2, employee: 'Taylor Kim', goal: 'Reduce support SLA', submitted: 'May 14', status: 'pending' },
  { id: 3, employee: 'Sam Patel', goal: 'Launch onboarding v2', submitted: 'May 10', status: 'pending' },
]

const teamProgress = [
  { name: 'Alex Rivera', role: 'Product Analyst', goals: 4, progress: 72, status: 'on-track' },
  { name: 'Taylor Kim', role: 'Support Lead', goals: 2, progress: 48, status: 'at-risk' },
  { name: 'Sam Patel', role: 'Engineer II', goals: 5, progress: 81, status: 'on-track' },
  { name: 'Riley Chen', role: 'Designer', goals: 3, progress: 55, status: 'at-risk' },
]

export default function ManagerDashboard() {
  return (
    <SidebarLayout role="manager">
      <section id="top" className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Team overview</h1>
        <p className="mt-2 text-zinc-400 max-w-2xl">
          Monitor direct reports, approve goal changes, and stay ahead of blockers.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard label="Team members" value="4" />
        <StatCard label="Goals on track" value="10 / 14" hint="71% healthy" trend="up" />
        <StatCard label="Pending approvals" value="3" hint="Action required" />
        <StatCard label="Avg. team progress" value="64%" />
      </section>

      <section id="approvals" className="rounded-xl border border-zinc-800 bg-zinc-900/40 overflow-hidden mb-8">
        <div className="px-5 py-4 border-b border-zinc-800">
          <h2 className="font-semibold text-lg">Pending approvals</h2>
          <p className="text-xs text-zinc-500 mt-0.5">Goal submissions awaiting your review</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-zinc-500 border-b border-zinc-800 bg-zinc-900/60">
                <th className="px-5 py-3 font-medium">Employee</th>
                <th className="px-5 py-3 font-medium">Goal</th>
                <th className="px-5 py-3 font-medium hidden sm:table-cell">Submitted</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {approvals.map((row) => (
                <tr key={row.id} className="hover:bg-zinc-800/30 transition">
                  <td className="px-5 py-4 font-medium">{row.employee}</td>
                  <td className="px-5 py-4">{row.goal}</td>
                  <td className="px-5 py-4 text-zinc-400 hidden sm:table-cell">{row.submitted}</td>
                  <td className="px-5 py-4">
                    <StatusBadge status="pending" />
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <button type="button" className="text-xs font-medium text-emerald-400 hover:underline">
                        Approve
                      </button>
                      <button type="button" className="text-xs font-medium text-zinc-500 hover:underline">
                        Decline
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="team" className="rounded-xl border border-zinc-800 bg-zinc-900/40 overflow-hidden mb-8">
        <div className="px-5 py-4 border-b border-zinc-800">
          <h2 className="font-semibold text-lg">Team progress</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-zinc-500 border-b border-zinc-800 bg-zinc-900/60">
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium hidden md:table-cell">Role</th>
                <th className="px-5 py-3 font-medium">Goals</th>
                <th className="px-5 py-3 font-medium min-w-[180px]">Progress</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {teamProgress.map((member) => (
                <tr key={member.name} className="hover:bg-zinc-800/30 transition">
                  <td className="px-5 py-4 font-medium">{member.name}</td>
                  <td className="px-5 py-4 text-zinc-400 hidden md:table-cell">{member.role}</td>
                  <td className="px-5 py-4">{member.goals}</td>
                  <td className="px-5 py-4">
                    <ProgressBar value={member.progress} color="bg-sky-500" />
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={member.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <ManagerCheckInPanel />
    </SidebarLayout>
  )
}
