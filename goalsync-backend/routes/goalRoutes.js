import express from 'express'

import {
  createGoal,
  getGoals,
  updateGoal,
  deleteGoal,
} from '../controllers/goalController.js'

const router = express.Router()

router.post('/', createGoal)
router.get('/', getGoals)
router.put('/:id', updateGoal)
router.delete('/:id', deleteGoal)

export default router