const Joi = require('joi')

const userSchema = Joi.object({
  id: Joi.string()
    .guid({ version: ['uuidv4'] })
    .optional(),
  username: Joi.string().min(5).max(50).required().messages({
    'string.base': 'Username must be a string',
    'string.empty': 'Username is required',
    'string.min': 'Username must be at least 5 characters long',
    'string.max': 'Username must be less than or equal to 50 characters long',
    'any.required': 'Username is required',
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
