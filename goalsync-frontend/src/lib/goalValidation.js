export const MAX_GOALS = 8
export const MIN_WEIGHTAGE = 10
export const TARGET_TOTAL_WEIGHTAGE = 100

export const THRUST_AREAS = [
  'Growth',
  'Delivery',
  'People',
  'Efficiency',
  'Innovation',
  'Customer',
  'Financial',
]

export const UOM_TYPES = [
  'Number',
  'Percentage',
  'Currency (INR)',
  'Days',
  'Count',
  'Rating (1-5)',
]

export function getGoalStatus(progress) {
  if (progress >= 100) return 'completed'
  if (progress >= 70) return 'on-track'
  if (progress >= 40) return 'at-risk'
  if (progress > 0) return 'behind'
  return 'draft'
}

export function getTotalWeightage(goals) {
  return goals.reduce((sum, g) => sum + Number(g.weightage || 0), 0)
}

export function validateGoalForm(values, goals, editingId = null) {
  const errors = {}
  const weightage = Number(values.weightage)
  const target = Number(values.target)

  if (!values.thrustArea?.trim()) errors.thrustArea = 'Select a thrust area'
  if (!values.title?.trim()) errors.title = 'Goal title is required'
  if (!values.description?.trim()) errors.description = 'Description is required'
  if (!values.uomType?.trim()) errors.uomType = 'Select a UOM type'
  if (!values.target?.toString().trim()) errors.target = 'Target is required'
  else if (Number.isNaN(target) || target <= 0) errors.target = 'Enter a valid positive target'

  if (!values.weightage?.toString().trim()) errors.weightage = 'Weightage is required'
  else if (Number.isNaN(weightage)) errors.weightage = 'Enter a valid number'
  else if (weightage < MIN_WEIGHTAGE) errors.weightage = `Minimum weightage is ${MIN_WEIGHTAGE}%`
  else if (weightage > TARGET_TOTAL_WEIGHTAGE) errors.weightage = `Cannot exceed ${TARGET_TOTAL_WEIGHTAGE}%`

  const others = goals.filter((g) => g.id !== editingId)
  const otherTotal = getTotalWeightage(others)
  const newTotal = otherTotal + (Number.isNaN(weightage) ? 0 : weightage)

  if (!errors.weightage && newTotal > TARGET_TOTAL_WEIGHTAGE) {
    errors.weightage = `Total would be ${newTotal}% — only ${TARGET_TOTAL_WEIGHTAGE - otherTotal}% available`
  }

  if (!editingId && goals.length >= MAX_GOALS) {
    errors.form = `Maximum ${MAX_GOALS} goals allowed`
  }

  return errors
}

export function isWeightageBalanced(goals) {
  return goals.length > 0 && getTotalWeightage(goals) === TARGET_TOTAL_WEIGHTAGE
}
