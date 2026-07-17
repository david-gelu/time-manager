import { vi } from 'vitest'
import mongoose from 'mongoose'

// Mock firebase-admin
vi.mock('firebase-admin', () => ({
  default: {
    apps: [],
    initializeApp: vi.fn(),
    auth: () => ({
      verifyIdToken: vi.fn().mockResolvedValue({
        uid: 'test-user-123',
        email: 'test@example.com',
        name: 'Test User',
      }),
    }),
    credential: {
      cert: vi.fn(),
    },
  },
  apps: [],
  initializeApp: vi.fn(),
  auth: vi.fn(() => ({
    verifyIdToken: vi.fn().mockResolvedValue({
      uid: 'test-user-123',
      email: 'test@example.com',
      name: 'Test User',
    }),
  })),
  credential: {
    cert: vi.fn(),
  },
}))

// Mock mongoose
vi.mock('mongoose', () => {
  const mockModel = {
    find: vi.fn(),
    findOne: vi.fn(),
    findByIdAndUpdate: vi.fn(),
    findOneAndUpdate: vi.fn(),
    findOneAndDelete: vi.fn(),
    create: vi.fn(),
    deleteOne: vi.fn(),
    countDocuments: vi.fn(),
    aggregate: vi.fn(),
    save: vi.fn(),
    lean: vi.fn().mockReturnThis(),
    sort: vi.fn().mockReturnThis(),
    exec: vi.fn(),
  }

  class MockSchema {
    constructor() {
      this.index = vi.fn().mockReturnValue(this)
      return this
    }
    index: any
  }
  const mockSchema = MockSchema as any

  return {
    default: {
      connect: vi.fn().mockResolvedValue(true),
      Model: vi.fn(),
      Schema: mockSchema,
      model: vi.fn(() => mockModel),
      Types: {
        ObjectId: vi.fn(() => 'mock-object-id'),
      },
    },
    connect: vi.fn().mockResolvedValue(true),
    Schema: mockSchema,
    model: vi.fn(() => mockModel),
    Types: {
      ObjectId: vi.fn(() => 'mock-object-id'),
    },
    connection: {
      readyState: 1,
    },
  }
})

// Setup environment
process.env.MONGODB_URI = 'mongodb://localhost:27017/test'
process.env.FIREBASE_SERVICE_ACCOUNT_KEY = '{}'
process.env.FRONTEND_URL = 'http://localhost:5173'