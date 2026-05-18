import { API_BASE } from './config'
import { parseResponse } from './http'

export function normalizeGoal(goal) {
  const employee = goal.employeeId
  const employeeId =
    employee && typeof employee === 'object'
      ? (employee._id ?? employee.id)
      : goal.employeeId
  const employeeName =
    employee && typeof employee === 'object' ? (employee.name ?? '') : ''

  return {
    id: goal._id ?? goal.id,
    employeeId,
    employeeName,
    thrustArea: goal.thrustArea ?? '',
    title: goal.title ?? '',
    description: goal.description ?? '',
    uomType: goal.uomType ?? '',
    target: goal.target ?? 0,
    weightage: goal.weightage ?? 0,
    progress: goal.progress ?? 0,
    status: goal.status ?? 'draft',
  }
}

export async function fetchGoals() {
  const response = await fetch(`${API_BASE}/goals`)
  const data = await parseResponse(response)

  if (!response.ok) {
    throw new Error(data.message || 'Failed to load goals')
  }

  const list = Array.isArray(data) ? data : []
  return list.map(normalizeGoal)
}

export async function createGoal(payload) {
  const response = await fetch(`${API_BASE}/goals`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = await parseResponse(response)

  if (!response.ok) {
    throw new Error(data.message || 'Failed to create goal')
  }

  return normalizeGoal(data)
}

export async function updateGoal(id, payload) {
  const response = await fetch(`${API_BASE}/goals/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = await parseResponse(response)

  if (!response.ok) {
    throw new Error(data.message || 'Failed to update goal')
  }

  return normalizeGoal(data)
}

export async function deleteGoal(id) {
  const response = await fetch(`${API_BASE}/goals/${id}`, {
    method: 'DELETE',
  })
  const data = await parseResponse(response)

  if (!response.ok) {
    throw new Error(data.message || 'Failed to delete goal')
  }

  return data
}
