const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { User } = require('../models')

exports.register = async (req, res) => {
  const { username, password } = req.body
  console.log(username, password)
  const hashedPassword = await bcrypt.hash(password, 10)
  const user = await User.create({ username, password: hashedPassword })

  const token = jwt.sign({ id: user.id }, 'asdasdqwedchasdbfnaf123', {
    expiresIn: '1h',
  })
  res.status(201).json({ token })
}

exports.login = async (req, res) => {
  const { username, password } = req.body
  const user = await User.findOne({ where: { username } })

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid credentials' })
  }

  const token = jwt.sign({ id: user.id }, 'asdasdqwedchasdbfnaf123', {
    expiresIn: '1h',
  })
  res.json({ token })
}

exports.getCurrentUser = async (req, res) => {
  const user = await User.findByPk(req.user.id)
  res.json(user)
}
