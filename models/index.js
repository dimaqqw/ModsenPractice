const sequelize = require('../config/db')
const User = require('./user')
const Meetup = require('./meetup')
const Registration = require('./registration')

User.hasMany(Meetup, { foreignKey: 'organizerId' })
Meetup.belongsTo(User, { foreignKey: 'organizerId' })

User.belongsToMany(Meetup, { through: Registration, foreignKey: 'userId' })
Meetup.belongsToMany(User, { through: Registration, foreignKey: 'meetupId' })

module.exports = { sequelize, User, Meetup, Registration }
