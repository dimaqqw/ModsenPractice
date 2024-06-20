const { DataTypes } = require('sequelize')
const sequelize = require('../config/db')

const Meetup = sequelize.define('Meetup', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false,
  },
  time: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  place: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  organizerId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
})

module.exports = Meetup
