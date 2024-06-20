const express = require('express')
const bodyParser = require('body-parser')

const meetupRoutes = require('./routes/meetupRoutes')
const authRoutes = require('./routes/authRoutes')

const PORT = 3000

const app = express()

app.use(express.json())

app.get('/', (req, res) => {
  res.status(200).json('Сервер работает')
})

app.use('/api', meetupRoutes)
app.use('/api', authRoutes)

app.listen(PORT, () => console.log('SERVER STARTED ON PORT ' + PORT))
