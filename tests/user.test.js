const jwt = require('jsonwebtoken')
const User = require('../src/models/User')
const db = require('./db')
const { jwtSecret } = require('../src/config/env')
const userService = require('../src/services/user')

beforeAll(async () => await db.connectDb())

beforeEach(async () => await db.clearDb())

afterAll(async () => await db.closeDb())

describe('users service', () => {

  describe('create user', () => {

    it('should create user successfully', async () => {
      const userData = {
        name: 'Test user',
        password: '12345678'
      }

      const user = await userService.createUser(userData)
      
      expect(user._id).toBeDefined()
      expect(user.name).toBe(userData.name)
      expect(await user.comparePassword(userData.password)).toBeTruthy()
    })
  
    it('should not create the same user and throw error', async () => {
      const { user1 } = await createTestUsers()

      let error
      try {
        await userService.createUser(user1)
      } catch (err) {
        error = err
      }
      expect(error).toBeDefined()
    })

  })

  describe('get user', () => {

    it('should get user by name successfully', async () => {
      const { user1 } = await createTestUsers()

      const user = await userService.getUser(user1)
     
      expect(user._id).toBeDefined()
      expect(user.name).toBe(user1.name)
    })

    it('should not get non-existent user by name and throw error', async () => {
      const userData = {
        name: 'non-existed user',
        password: '12345678'
      }

      let error
      try {
        await userService.getUser(userData)
      } catch (err) {
        error = err
      }
      expect(error).toBeDefined()
    })

  })

  describe('validate user credentials', () => {

    it('should validate user credentials successfully', async () => {
      const userData = {
        name: 'Test user',
        password: '12345678'
      }

      const user = await User.create(userData)

      const validatedUser = await userService.validateUserCredentials({ user, password: userData.password })

      expect(validatedUser._id).toBeDefined()
      expect(validatedUser.name).toBe(user.name)
    })

    it('should not get the user with password if user does not exist, and throw unauthorized error', async () => {
      const userData = {
        name: 'Test user',
        password: '12345678'
      }

      const user = await User.create(userData)

      let error
      try {
        await userService.getUserWithPassword({ name: 'somewrongname' })
      } catch (err) {
        error = err
      }
      
      expect(error).toBeDefined()
    })

    it('should not validate user credentials with bad password and throw unauthorized error', async () => {
      const userData = {
        name: 'Test user',
        password: '12345678'
      }

      const user = await User.create(userData)

      let error
      try {
        await userService.validateUserCredentials({ user, password: 'somewrongpassword' })
      } catch (err) {
        error = err
      }
      
      expect(error).toBeDefined()
    })

  })

  describe('get signed jwt', () => {

    it('should return valid signed jwt for the user', async () => {
      const { user1 } = await createTestUsers()

      const token = userService.getSignedJwt(user1)
      const isValid = jwt.verify(token, jwtSecret)

      expect(isValid).toBeTruthy()
    })

  })

  describe('add to blocked users', () => {

    it('should add user to the blocked users', async () => {
      let { user1, user2 } = await createTestUsers()

      user1 = await userService.addToBlockedUsers(user1, user2)
      
      expect(user1.hasBlockFor(user2)).toBeTruthy()
    })

  })

  describe('remove from blocked users', () => {

    it('should remove user from the blocked users', async () => {
      let { user1, user2 } = await createTestUsers()

      user1 = await userService.addToBlockedUsers(user1, user2)
      user1 = await userService.removeFromBlockedUsers(user1, user2)
      
      expect(user1.hasBlockFor(user2)).toBeFalsy()
    })

  })

  describe('validate blocking action', () => {

    it('should validate the blocking action and not throw any error', async () => {
      let { user1, user2 } = await createTestUsers()

      userService.validateBlockingAction(user1, user2)
    })

    it('should not validate the blocking action and should throw error if users try to block themselves', async () => {
      let { user1 } = await createTestUsers()

      let error
      try {
        userService.validateBlockingAction(user1, user1)
      } catch (err) {
        error = err
      }
      expect(error).toBeDefined()
    })

  })

})

async function createTestUsers() {
  const user1 = await User.create({
    name: 'John',
    password: '12345678',
  })

  const user2 = await User.create({
    name: 'Marry',
    password: '12345678',
  })

  return {
    user1,
    user2,
  }
}