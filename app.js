const express = require('express')
const cookieParser = require('cookie-parser')
const swaggerJsdoc = require('./docs/swagger')
const swaggerUi = require('swagger-ui-express')

const meetupRoutes = require('./routes/meetupRoutes')
const authRoutes = require('./routes/authRoutes')

const PORT = 3000

const app = express()

app.use(cookieParser())
app.use(express.json())

app.get('/', (req, res) => {
  res.status(200).json('Сервер работает')
})

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJsdoc.specs))

app.use('/api', meetupRoutes)
app.use('/api', authRoutes)

app.listen(PORT, () => console.log('SERVER STARTED ON PORT ' + PORT))
