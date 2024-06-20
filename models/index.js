const sequelize = require('../config/db')
const User = require('./user')
const Meetup = require('./meetup')

User.hasMany(Meetup, { foreignKey: 'organizerId' })
Meetup.belongsTo(User, { foreignKey: 'organizerId' })

module.exports = { sequelize, User, Meetup }
