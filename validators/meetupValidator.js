const Joi = require('joi')

const meetupSchema = Joi.object({
  title: Joi.string().trim().min(5).max(100).required().messages({
    'string.base': 'Title must be a string',
    'string.empty': 'Title is required',
    'string.min': 'Title must be at least 5 characters long',
    'string.max': 'Title must be less than or equal to 100 characters long',
    'any.required': 'Title is required',
  }),
  description: Joi.string().trim().required().messages({
    'string.base': 'Description must be a string',
    'string.empty': 'Description is required',
    'any.required': 'Description is required',
  }),
  tags: Joi.array()
    .items(Joi.string().trim().min(2).max(20))
    .required()
    .min(1)
    .messages({
      'array.base': 'Tags must be an array',
      'array.empty': 'At least one tag is required',
      'array.min': 'At least one tag is required',
      'any.required': 'Tags are required',
      'string.base': 'Each tag must be a string',
      'string.min': 'Each tag must be at least 2 characters long',
      'string.max': 'Each tag must be less than or equal to 20 characters long',
    }),
  date: Joi.date().greater('now').required().messages({
    'date.base': 'Date must be a valid date',
    'date.greater': 'Date must be in the future',
    'any.required': 'Date is required',
  }),
  location: Joi.string().trim().required().messages({
    'string.base': 'Location must be a string',
    'string.empty': 'Location is required',
    'any.required': 'Location is required',
  }),
  organizerId: Joi.string()
    .guid({ version: ['uuidv4'] })
    .optional(),
})

module.exports = { meetupSchema }
