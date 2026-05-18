import mongoose from 'mongoose'

const goalSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    thrustArea: String,

    title: String,

    description: String,

    uomType: String,

    target: Number,

    weightage: Number,

    progress: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      default: 'draft',
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model('Goal', goalSchema)