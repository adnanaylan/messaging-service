const dotenv = require('dotenv')

const envConfig = dotenv.config()

if (envConfig.error) {
  throw new Error('Couldn\'t find a dotenv file')
}

module.exports = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: process.env.PORT,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpire: process.env.JWT_EXPIRE
}
