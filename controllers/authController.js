const authService = require('../services/authService')

exports.register = async (req, res) => {
  try {
    const { login, email, password, role } = req.body
    const { token, refreshToken } = await authService.registerUser({
      login,
      email,
      password,
      role,
    })

    res.cookie('accessToken', token, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000,
      sameSite: 'Strict',
    })

    res.status(201).json({ token, refreshToken })
  } catch (error) {
    res.status(409).json({ message: error.message })
  }
}

exports.login = async (req, res) => {
  try {
    const { login, password } = req.body
    const { token, refreshToken } = await authService.loginUser(login, password)

    res.cookie('accessToken', token, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000,
      sameSite: 'Strict',
    })

    res.json({ token, refreshToken })
  } catch (error) {
    res.status(401).json({ message: error.message })
  }
}

exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body
    const tokens = await authService.refreshToken(refreshToken)

    res.cookie('accessToken', tokens.token, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000,
      sameSite: 'Strict',
    })

    res.json(tokens)
  } catch (error) {
    res.status(401).json({ message: error.message })
  }
}

exports.getCurrentUser = async (req, res) => {
  try {
    const user = await authService.getCurrentUser(req.user.id)
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve user' })
  }
}
