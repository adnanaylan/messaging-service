const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')

const mongoServer = new MongoMemoryServer()

/**
 * Connect to the in-memory database.
 */
module.exports.connectDb = async () => {
  const mongoUri = await mongoServer.getUri()

  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  }

  await mongoose.connect(mongoUri, options, error => {
    if (error) console.log(error)
  })
}

/**
 * Close the connection and stop mongod.
 */
module.exports.closeDb = async () => {
  await mongoose.disconnect()
  await mongoServer.stop()
}

/**
 * Remove all the data for all db collections.
 */
module.exports.clearDb = async () => {
  const collections = mongoose.connection.collections

  for (const key in collections) {
    const collection = collections[key]
    await collection.deleteMany()
  }
}
