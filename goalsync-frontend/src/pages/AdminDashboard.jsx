import { useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts'
import SidebarLayout from '../components/SidebarLayout'
import StatCard from '../components/StatCard'
import StatusBadge from '../components/StatusBadge'
import ProgressBar from '../components/ProgressBar'
import { fetchGoals } from '../api/goals'
import {
  buildGoalsReportCsv,
  downloadCsvFile,
  getReportFilename,
  goalsToReportRows,
} from '../lib/exportGoalsCsv'

const completionByDept = [
  { dept: 'Engineering', completion: 88 },
  { dept: 'Product', completion: 91 },
  { dept: 'Sales', completion: 76 },
  { dept: 'Marketing', completion: 84 },
  { dept: 'HR', completion: 92 },
]

const monthlyTrend = [
  { month: 'Jan', rate: 62 },
  { month: 'Feb', rate: 68 },
  { month: 'Mar', rate: 74 },
  { month: 'Apr', rate: 79 },
  { month: 'May', rate: 84 },
]

const statusDistribution = [
  { name: 'On track', value: 58, color: '#10b981' },
  { name: 'At risk', value: 22, color: '#f59e0b' },
  { name: 'Behind', value: 12, color: '#ef4444' },
  { name: 'Completed', value: 8, color: '#8b5cf6' },
]

const auditLogs = [
  { id: 1, user: 'Jordan Lee', action: 'Approved goal cycle Q2', time: '2h ago' },
  { id: 2, user: 'System', action: 'Synced 105 employee records', time: '5h ago' },
  { id: 3, user: 'Sam Patel', action: 'Updated shared goal "Revenue 20%"', time: '1d ago' },
  { id: 4, user: 'Alex Rivera', action: 'Submitted new individual goal', time: '1d ago' },
]

const sharedGoals = [
  { title: 'Increase ARR 20%', owner: 'Executive', progress: 67, departments: 5 },
  { title: 'Improve eNPS to 45', owner: 'HR', progress: 52, departments: 4 },
  { title: 'Launch AI assistant beta', owner: 'Product', progress: 38, departments: 3 },
]

const chartTooltipStyle = {
  contentStyle: {
    backgroundColor: '#18181b',
    border: '1px solid #3f3f46',
    borderRadius: '8px',
    fontSize: '12px',
  },
  labelStyle: { color: '#a1a1aa' },
}

export default function AdminDashboard() {
  const [exporting, setExporting] = useState(false)
  const [exportError, setExportError] = useState(null)

  async function handleExportCsv() {
    setExporting(true)
    setExportError(null)

    try {
      const goals = await fetchGoals()
      const rows = goalsToReportRows(goals)

      if (rows.length === 0) {
        setExportError('No goals available to export')
        return
      }

      const csv = buildGoalsReportCsv(rows)
      downloadCsvFile(csv, getReportFilename())
    } catch (err) {
      setExportError(err.message || 'Failed to export goals report')
    } finally {
      setExporting(false)
    }
  }

  return (
    <SidebarLayout role="admin">
      <section id="top" className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Organization analytics</h1>
            <p className="mt-2 text-zinc-400 max-w-2xl">
              Company-wide goal health, completion trends, and compliance visibility.
            </p>
          </div>
          <div className="flex flex-col items-stretch sm:items-end gap-2 shrink-0">
            <button
              type="button"
              onClick={handleExportCsv}
              disabled={exporting}
              className="rounded-lg border border-violet-500/40 bg-violet-600/20 px-4 py-2 text-sm font-semibold text-violet-300 hover:bg-violet-600/30 hover:text-violet-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {exporting ? 'Exporting…' : 'Export CSV'}
            </button>
            {exportError && (
              <p className="text-xs text-red-400 max-w-xs sm:text-right">{exportError}</p>
            )}
          </div>
        </div>
      </section>

      <section id="org" className="grid gap-6 lg:grid-cols-2 mb-8">
        <StatCard label="Total employees" value="105" hint="+8 this quarter" trend="up" />
        <StatCard label="Org completion" value="84%" hint="Q2 2026 cycle" trend="up" />
        <StatCard label="Active goals" value="312" />
        <StatCard label="At-risk goals" value="34" hint="10.9% of total" trend="down" />
      </section>

      <section className="grid gap-6 lg:grid-cols-2 mb-8">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
          <h2 className="font-semibold">Completion by department</h2>
          <p className="text-xs text-zinc-500 mt-1 mb-4">Average goal completion %</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={completionByDept} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="dept" tick={{ fill: '#a1a1aa', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#a1a1aa', fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                <Tooltip contentStyle={chartTooltipStyle.contentStyle} />
                <Bar dataKey="completion" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
          <h2 className="font-semibold">Monthly completion trend</h2>
          <p className="text-xs text-zinc-500 mt-1 mb-4">Org-wide % complete</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrend} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="month" tick={{ fill: '#a1a1aa', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#a1a1aa', fontSize: 11 }} axisLine={false} tickLine={false} domain={[50, 100]} />
                <Tooltip contentStyle={chartTooltipStyle.contentStyle} />
                <Line type="monotone" dataKey="rate" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3 mb-8">
        <div className="lg:col-span-1 rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
          <h2 className="font-semibold">Goal status distribution</h2>
          <p className="text-xs text-zinc-500 mt-1 mb-2">All active goals</p>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={2}
                >
                  {statusDistribution.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={chartTooltipStyle.contentStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-2 space-y-1.5">
            {statusDistribution.map((s) => (
              <li key={s.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-zinc-400">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} />
                  {s.name}
                </span>
                <span className="font-medium tabular-nums">{s.value}%</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-2 rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
          <h2 className="font-semibold">Completion statistics</h2>
          <p className="text-xs text-zinc-500 mt-1 mb-6">Key metrics for current review cycle</p>
          <div className="space-y-5">
            {[
              { label: 'Individual goals submitted', value: 94, target: 100 },
              { label: 'Manager reviews completed', value: 78, target: 100 },
              { label: 'Mid-cycle check-ins logged', value: 61, target: 100 },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-zinc-300">{item.label}</span>
                  <span className="text-zinc-500 tabular-nums">
                    {item.value}% / {item.target}%
                  </span>
                </div>
                <ProgressBar value={item.value} color="bg-violet-500" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div id="audit" className="rounded-xl border border-zinc-800 bg-zinc-900/40 overflow-hidden">
          <div className="px-5 py-4 border-b border-zinc-800">
            <h2 className="font-semibold text-lg">Audit logs</h2>
            <p className="text-xs text-zinc-500 mt-0.5">Recent system & user activity</p>
          </div>
          <ul className="divide-y divide-zinc-800">
            {auditLogs.map((log) => (
              <li key={log.id} className="px-5 py-4 hover:bg-zinc-800/30 transition">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium">{log.action}</p>
                    <p className="text-xs text-zinc-500 mt-0.5">{log.user}</p>
                  </div>
                  <span className="text-xs text-zinc-500 shrink-0">{log.time}</span>
                </div>
              </li>
            ))}
          </ul>
          <div className="px-5 py-3 border-t border-zinc-800">
            <button type="button" className="text-xs font-medium text-violet-400 hover:underline">
              View full audit trail
            </button>
          </div>
        </div>

        <div id="shared" className="rounded-xl border border-zinc-800 bg-zinc-900/40 overflow-hidden">
          <div className="px-5 py-4 border-b border-zinc-800">
            <h2 className="font-semibold text-lg">Shared goals</h2>
            <p className="text-xs text-zinc-500 mt-0.5">Company-wide objectives</p>
          </div>
          <ul className="divide-y divide-zinc-800">
            {sharedGoals.map((goal) => (
              <li key={goal.title} className="px-5 py-4">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <p className="font-medium">{goal.title}</p>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      {goal.owner} · {goal.departments} departments
                    </p>
                  </div>
                  <StatusBadge status="on-track" label="Active" />
                </div>
                <ProgressBar value={goal.progress} color="bg-violet-500" />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </SidebarLayout>
  )
}
