const express = require('express')
const mongoose = require('mongoose')
const http = require('http')
const sheetsController = require('./sheetsController/sheetsController')
const userRoutes = require('./userController/userController')
const cors = require('cors')
const socketIO = require('socket.io')
const app = express()

require('dotenv').config()

const port = process.env.PORT || 3001
app.use(cors())
app.use(express.json())

const server = http.createServer(app)
const io = socketIO(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  },
}) // Attach Socket.IO to the HTTP server with CORS options

io.on('connection', (socket) => {
  console.log('a user connected')

  socket.on('addJob', async (job) => {
    try {
      // Add Job to the sheet in the database using the controller function
      const data = await sheetsController.addJob(job)
      // Emit an event to inform other connected clients about the data update
      io.emit('addJob', data)
    } catch (error) {
      console.error(error)
    }
  })

  socket.on('deleteJob', async ({ recordId }) => {
    try {
      // Delete the Job in the sheet in the database using the controller function
      const data = await sheetsController.deleteJob(recordId)
      // Emit an event to inform other connected clients about the data update
      io.emit('deleteJob', data)
    } catch (error) {
      console.error(error)
    }
  })

  socket.on('updateSheetProperty', async (updateJob) => {
    try {
      // Update the property of the sheet in the database using the controller function
      const data = await sheetsController.updateProperty(updateJob)

      // Emit an event to inform other connected clients about the data update
      io.emit('updateSheetProperty', data)
    } catch (error) {
      console.error(error)
    }
  })
})

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB Atlas')
    server.listen(port, () => {
      console.log(`Server is running on port ${port}`)
    })
  })
  .catch((err) => console.log(err))

app.use('/user', userRoutes)
app.use('/sheets', sheetsController.router)
