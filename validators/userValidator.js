const Joi = require('joi')

const userSchema = Joi.object({
  id: Joi.string()
    .guid({ version: ['uuidv4'] })
    .optional(),
  login: Joi.string().min(5).max(50).required().messages({
    'string.base': 'Login must be a string',
    'string.empty': 'Login is required',
    'string.min': 'Login must be at least 5 characters long',
    'string.max': 'Login must be less than or equal to 50 characters long',
    'any.required': 'Login is required',
  }),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.base': 'Email must be a string',
      'string.empty': 'Email is required',
      'string.email': 'Email must be a valid email address',
      'any.required': 'Email is required',
    }),
  password: Joi.string().min(8).max(100).required().messages({
    'string.base': 'Password must be a string',
    'string.empty': 'Password is required',
    'string.min': 'Password must be at least 8 characters long',
    'string.max': 'Password must be less than or equal to 100 characters long',
    'any.required': 'Password is required',
  }),
  role: Joi.string().valid('user', 'organizer').default('user').messages({
    'string.base': 'Role must be a string',
    'any.only': 'Role must be either user or organizer',
  }),
})

module.exports = { userSchema }
