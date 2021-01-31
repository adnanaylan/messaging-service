const Message = require('../src/models/Message')
const User = require('../src/models/User')
const messageService = require('../src/services/message')
const db = require('./db')

beforeAll(async () => await db.connectDb())

beforeEach(async () => await db.clearDb())

afterAll(async () => await db.closeDb())

describe('message service', () => {

  describe('create message', () => {

    it('should create a message and return the created message', async () => {
      const { user1, user2 } = await createTestUsers()

      const content = 'Test messsage.'

      const message = await messageService.createMessage({
        content,
        sentFrom: user1._id,
        sentTo: user2._id,
      })

      expect(message._id).toBeDefined()
      expect(message.sentFrom._id).toEqual(user1._id)
      expect(message.sentTo._id).toEqual(user2._id)
      expect(message.createdAt).toBeDefined()
    })

    it('should not create a message and should throw error if message content is not provided', async () => {
      const { user1, user2 } = await createTestUsers()

      let error
      let message

      try {
        message = await messageService.createMessage({
          sentFrom: user1._id,
          sentTo: user2._id,
        })
      } catch (err) {
        error = err
      }

      expect(message).toBeUndefined()
      expect(error).toBeDefined()
    })

    it('should not create a message and should throw error if message recevier does not exist', async () => {
      const { user1, user2 } = await createTestUsers()

      let error
      let message

      try {
        message = await messageService.createMessage({
          content: 'Test message.',
          sentFrom: user1._id,
        })
      } catch (err) {
        error = err
      }

      expect(message).toBeUndefined()
      expect(error).toBeDefined()
    })

  })

  describe('get messages', () => {

    it('should get all the sent and received messages for the user', async () => {
      const { user1, user2 } = await createTestUsers()

      await Message.create({
        content: 'Test message.',
        sentFrom: user1._id,
        sentTo: user2._id, 
      })

      await Message.create({
        content: 'Another test message.',
        sentFrom: user2._id,
        sentTo: user1._id,        
      })

      const mockMessage1 = {
        content: 'Test message.',
        sentFrom: {
          _id: user1._id,
          name: user1.name
        },
        sentTo: {
          _id: user2._id,
          name: user2.name
        },  
      }

      const mockMessage2 = {
        content: 'Another test message.',
        sentFrom: {
          _id: user2._id,
          name: user2.name
        },
        sentTo: {
          _id: user1._id,
          name: user1.name
        },      
      }

      const messages = await messageService.getMessages(user1)

      expect(messages).toMatchObject([mockMessage1, mockMessage2])
    })

  })

  describe('is allowed send message', () => {

    it('should not throw error when the message sender and the receiver different users and has no block', async () => {
      const { user1, user2 } = await createTestUsers()
      
      let error
      try {
        messageService.isAllowedToSendMessage(user1, user2)
      } catch (err) {
        error = err
      }

      expect(error).toBeUndefined()
    })

    it('should throw error when the message sender is the message receiver', async () => {
      const { user1 } = await createTestUsers()
      
      let error
      try {
        messageService.isAllowedToSendMessage(user1, user1)
      } catch (err) {
        error = err
      }

      expect(error).toBeDefined()
    })


    it('should throw error when the message sender is blocked by the receiver', async () => {
      let { user1, user2 } = await createTestUsers()
      
      user2 = await User.findByIdAndUpdate(user2._id,{ $addToSet: { blockedUsers: user1._id }}, { new: true })
      
      let error
      try {
        messageService.isAllowedToSendMessage(user2, user1)
      } catch (err) {
        error = err
      }

      expect(error).toBeDefined()
    })

    it('should throw error when the message sender has block for the receiver', async () => {
      let { user1, user2 } = await createTestUsers()
      
      user1 = await User.findByIdAndUpdate(user1._id,{ $addToSet: { blockedUsers: user2._id }}, { new: true })

      let error
      try {
        messageService.isAllowedToSendMessage(user2, user1)
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