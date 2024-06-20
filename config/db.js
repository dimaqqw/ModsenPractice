const { Sequelize } = require('sequelize')

const sequelize = new Sequelize('modsenpractice', 'postgres', 'dmitr2004', {
  dialect: 'postgres',
  port: 5000,
  logging: false,
})

module.exports = sequelize
