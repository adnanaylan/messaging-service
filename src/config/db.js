const mongoose = require('mongoose')

const { mongoUri } = require('./env')

const connectDB = async () => {
  const { connection } = await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  })

  console.log(`MongoDB connected to ${connection.name}`)
}

module.exports = connectDB
