import express from 'express'

const PORT = 3000

const app = express()

app.use(express.json())

app.get('/', (req, res) => {
  res.status(200).json('Сервер работает')
})

app.listen(PORT, () => console.log('SERVER STARTED ON PORT ' + PORT))
