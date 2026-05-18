import mongoose from 'mongoose'
import Goal from '../models/Goal.js'

const UPDATABLE_FIELDS = [
  'employeeId',
  'thrustArea',
  'title',
  'description',
  'uomType',
  'target',
  'weightage',
  'progress',
  'status',
]

function pickUpdates(body) {
  const updates = {}
  for (const key of UPDATABLE_FIELDS) {
    if (body[key] !== undefined) {
      updates[key] = body[key]
    }
  }
  return updates
}

export const createGoal = async (req, res) => {
  try {
    const goal = await Goal.create(req.body)

    res.status(201).json(goal)
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

export const getGoals = async (req, res) => {
  try {
    const goals = await Goal.find().populate('employeeId', 'name email role')

    res.json(goals)
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

export const updateGoal = async (req, res) => {
  try {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid goal id' })
    }

    const updates = pickUpdates(req.body)

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: 'No valid fields to update' })
    }

    const goal = await Goal.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    })

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' })
    }

    res.json(goal)
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

export const deleteGoal = async (req, res) => {
  try {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid goal id' })
    }

    const goal = await Goal.findByIdAndDelete(id)

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' })
    }

    res.json({ message: 'Goal deleted', id: goal._id })
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}
