import mongoose from 'mongoose'
import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'

import User from './models/User.js'

dotenv.config()

mongoose.connect(process.env.MONGO_URI)

const seedUsers = async () => {
  try {
    await User.deleteMany()

    const users = [
      {
        name: 'Alex Rivera',
        email: 'employee@test.com',
        password: await bcrypt.hash('123456', 10),
        role: 'employee',
      },

      {
        name: 'Jordan Lee',
        email: 'manager@test.com',
        password: await bcrypt.hash('123456', 10),
        role: 'manager',
      },

      {
        name: 'Sam Patel',
        email: 'admin@test.com',
        password: await bcrypt.hash('123456', 10),
        role: 'admin',
      },
    ]

    await User.insertMany(users)

    console.log('Demo users seeded')

    process.exit()
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

seedUsers()