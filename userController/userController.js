const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const router = express.Router()

// POST /users - Create a new user
router.post('/', async (req, res) => {
  try {
    const { email, password } = req.body

    // Check if user with the same email already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' })
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create the new user
    const user = await User.create({ email, password: hashedPassword })

    res.status(201).json({ user })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Error creating user' })
  }
})

// DELETE /users/:id - Delete a user by ID
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    res.json({ message: 'User deleted successfully' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Error deleting user' })
  }
})

// POST /users/login - User login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    // Check if user with the email exists
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ error: 'Invalid Email' })
    }

    // Check if the password is correct

    const passwordMatches = await bcrypt.compare(password, user.password)
    if (!passwordMatches) {
      return res.status(401).json({ error: 'Invalid Password' })
    }

    // Create and sign a JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    })
    res.json({ token })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Error logging in user' })
  }
})

module.exports = router
