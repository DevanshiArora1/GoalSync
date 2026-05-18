import { useCallback, useEffect, useMemo, useState } from 'react'
import SidebarLayout from '../components/SidebarLayout'
import StatCard from '../components/StatCard'
import GoalFormModal from '../components/employee/GoalFormModal'
import GoalsTable from '../components/employee/GoalsTable'
import WeightageSummary from '../components/employee/WeightageSummary'
import EmployeeCheckInPanel from '../components/checkin/EmployeeCheckInPanel'
import { fetchGoals, createGoal, updateGoal, deleteGoal as deleteGoalApi } from '../api/goals'
import { getStoredUserId } from '../lib/authStorage'
import {
  MAX_GOALS,
  TARGET_TOTAL_WEIGHTAGE,
  getGoalStatus,
  getTotalWeightage,
  isWeightageBalanced,
} from '../lib/goalValidation'

function filterGoalsForUser(goals, userId) {
  if (!userId) return goals
  return goals.filter((g) => String(g.employeeId) === String(userId))
}

export default function EmployeeDashboard() {
  const [goals, setGoals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingGoal, setEditingGoal] = useState(null)

  const loadGoals = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchGoals()
      const userId = getStoredUserId()
      setGoals(filterGoalsForUser(data, userId))
    } catch (err) {
      setError(err.message || 'Failed to load goals')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadGoals()
  }, [loadGoals])

  const totalWeight = getTotalWeightage(goals)
  const balanced = isWeightageBalanced(goals)
  const avgProgress = useMemo(() => {
    if (goals.length === 0) return 0
    return Math.round(goals.reduce((s, g) => s + g.progress, 0) / goals.length)
  }, [goals])

  const statusCounts = useMemo(() => {
    const counts = { 'on-track': 0, 'at-risk': 0, behind: 0, draft: 0, completed: 0 }
    goals.forEach((g) => {
      const status = getGoalStatus(g.progress)
      counts[status] = (counts[status] || 0) + 1
    })
    return counts
  }, [goals])

  const onTrackCount = statusCounts['on-track'] + statusCounts.completed

  function openCreateModal() {
    if (goals.length >= MAX_GOALS || loading) return
    setEditingGoal(null)
    setModalOpen(true)
  }

  function openEditModal(goal) {
    setEditingGoal(goal)
    setModalOpen(true)
  }

  async function handleSave(goalData) {
    if (editingGoal) {
      const snapshot = goals
      const optimistic = {
        ...editingGoal,
        ...goalData,
      }

      setGoals((prev) =>
        prev.map((g) => (g.id === editingGoal.id ? optimistic : g)),
      )
      setSaving(true)
      setError(null)

      try {
        const updated = await updateGoal(editingGoal.id, {
          thrustArea: goalData.thrustArea,
          title: goalData.title,
          description: goalData.description,
          uomType: goalData.uomType,
          target: goalData.target,
          weightage: goalData.weightage,
          progress: editingGoal.progress,
          status: editingGoal.status ?? getGoalStatus(editingGoal.progress),
        })
        setGoals((prev) => prev.map((g) => (g.id === updated.id ? updated : g)))
        return true
      } catch (err) {
        setGoals(snapshot)
        setError(err.message || 'Failed to update goal')
        throw err
      } finally {
        setSaving(false)
      }
    }

    const employeeId = getStoredUserId()
    if (!employeeId) {
      throw new Error('Sign in again to create goals')
    }

    setSaving(true)
    setError(null)
    try {
      const created = await createGoal({
        employeeId,
        thrustArea: goalData.thrustArea,
        title: goalData.title,
        description: goalData.description,
        uomType: goalData.uomType,
        target: goalData.target,
        weightage: goalData.weightage,
        progress: 0,
        status: 'draft',
      })
      setGoals((prev) => [...prev, created])
      return true
    } catch (err) {
      setError(err.message || 'Failed to create goal')
      throw err
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    const snapshot = goals
    setGoals((prev) => prev.filter((g) => g.id !== id))
    setDeletingId(id)
    setError(null)

    try {
      await deleteGoalApi(id)
    } catch (err) {
      setGoals(snapshot)
      setError(err.message || 'Failed to delete goal')
    } finally {
      setDeletingId(null)
    }
  }

  async function handleProgressChange(id, progress) {
    const goal = goals.find((g) => g.id === id)
    if (!goal || goal.progress === progress) return

    const snapshot = goals
    const status = getGoalStatus(progress)
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, progress, status } : g)),
    )

    try {
      const updated = await updateGoal(id, { progress, status })
      setGoals((prev) => prev.map((g) => (g.id === id ? updated : g)))
    } catch (err) {
      setGoals(snapshot)
      setError(err.message || 'Failed to update progress')
    }
  }

  return (
    <SidebarLayout role="employee">
      <section id="top" className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Welcome back, Alex</h1>
        <p className="mt-2 text-zinc-400 max-w-2xl">
          {loading
            ? 'Loading your goals…'
            : goals.length === 0
              ? 'Define your Q2 objectives — allocate up to 8 goals with 100% total weightage.'
              : balanced
                ? `Your ${goals.length} goals are fully allocated. Track progress before mid-quarter review.`
                : `You have ${goals.length} goal${goals.length === 1 ? '' : 's'} — allocate ${TARGET_TOTAL_WEIGHTAGE - totalWeight}% more weightage to reach 100%.`}
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard
          label="Active goals"
          value={loading ? '—' : String(goals.length)}
          hint={`Max ${MAX_GOALS} per cycle`}
        />
        <StatCard
          label="Avg. progress"
          value={loading ? '—' : `${avgProgress}%`}
          hint="Across all objectives"
        />
        <StatCard
          label="On track"
          value={loading ? '—' : String(onTrackCount)}
          hint={goals.length ? `${Math.round((onTrackCount / goals.length) * 100)}% of goals` : 'No goals yet'}
        />
        <StatCard
          label="Weightage"
          value={loading ? '—' : `${totalWeight}%`}
          hint={balanced ? 'Fully allocated' : `Target ${TARGET_TOTAL_WEIGHTAGE}%`}
          trend={balanced ? 'up' : undefined}
        />
      </section>

      <section id="goals" className="rounded-xl border border-zinc-800 bg-zinc-900/40 overflow-hidden mb-8 shadow-xl shadow-black/10">
        <div className="px-5 py-4 border-b border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-semibold text-lg">My goals</h2>
            <p className="text-xs text-zinc-500 mt-0.5">Q2 2026 · Individual objectives</p>
          </div>
          <button
            type="button"
            onClick={openCreateModal}
            disabled={loading || saving || goals.length >= MAX_GOALS}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold hover:bg-emerald-500 transition shrink-0 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-emerald-600 shadow-lg shadow-emerald-900/25"
          >
            + Add Goal
          </button>
        </div>

        {error && (
          <div className="mx-5 mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3">
            <p className="text-sm text-red-400">{error}</p>
            <button
              type="button"
              onClick={loadGoals}
              className="text-xs font-semibold text-red-300 hover:text-red-200 shrink-0"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && goals.length > 0 && <WeightageSummary goals={goals} />}

        <GoalsTable
          goals={goals}
          loading={loading}
          error={error}
          onRetry={loadGoals}
          onEdit={openEditModal}
          onDelete={handleDelete}
          deletingId={deletingId}
          onProgressChange={handleProgressChange}
        />
      </section>

      <EmployeeCheckInPanel />

      <GoalFormModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setEditingGoal(null)
        }}
        onSave={handleSave}
        goals={goals}
        editingGoal={editingGoal}
        saving={saving}
      />
    </SidebarLayout>
  )
}
