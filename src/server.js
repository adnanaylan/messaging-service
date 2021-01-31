const express = require('express')
const cluster = require('cluster')
const morgan = require('morgan')
const cpuCount = require('os').cpus().length

const connectDB = require('./config/db')
const { port, nodeEnv } = require('./config/env')

const errorHandler = require('./middlewares/error-handler')
const logger = require('./utils/logger')

const auth = require('./routes/auth')
const messages = require('./routes/messages')
const users = require('./routes/users')

// Init clusters
if (cluster.isMaster) {
  for (let i = 0; i < cpuCount; i++) {
    cluster.fork()
  }

  cluster.on('online', (worker) => {
    console.log('Worker ' + worker.process.pid + ' is online')
  })

  cluster.on('exit', (worker, code, signal) => {
    // Spawn a new worker, if a worker crashes
    if (code !== 0 && !worker.exitedAfterDisconnect) {
      console.log(`Worker ${worker.process.pid} crashed. Starting a new worker...`)

      const newWorker = cluster.fork()

      console.log(`Worker ${newWorker.process.pid} will replace him`)
    }
  })
} else {
  // Init express application
  const app = express()

  // Connect to database
  connectDB()

  // Use body parser
  app.use(express.json())

  // Log HTTP requests in development environment
  app.use(morgan('combined', { stream: logger.stream }))

  // Mount routers
  app.use('/api/auth', auth)
  app.use('/api/messages', messages)
  app.use('/api/users', users)

  // Error handler
  app.use(errorHandler)

  // Listen
  app.listen(port, console.log(`Server running on port ${port} in ${nodeEnv} mode`))

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (error, promise) => {
    console.log(`Error: ${error}`)
  })
}
