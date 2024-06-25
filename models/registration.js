const { DataTypes } = require('sequelize')
const sequelize = require('../config/db')

const Registration = sequelize.define(
  'Registration',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    meetupId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = Registration
