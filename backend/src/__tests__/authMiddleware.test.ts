import { describe, it, expect, vi, beforeEach } from 'vitest'

// We must re-mock firebase-admin in this file to control verifyIdToken behavior
vi.mock('firebase-admin', () => {
  const mockVerifyIdToken = vi.fn().mockResolvedValue({
    uid: 'test-user-123',
    email: 'test@example.com',
    name: 'Test User',
  })

  return {
    default: {
      apps: [],
      initializeApp: vi.fn(),
      auth: vi.fn(() => ({
        verifyIdToken: mockVerifyIdToken,
      })),
      credential: { cert: vi.fn() },
    },
    apps: [],
    initializeApp: vi.fn(),
    auth: vi.fn(() => ({
      verifyIdToken: mockVerifyIdToken,
    })),
    credential: { cert: vi.fn() },
  }
})

import { authMiddleware } from '../middleware/authMiddleware'

function mockResponse() {
  const res: any = {}
  res.status = vi.fn().mockReturnValue(res)
  res.json = vi.fn().mockReturnValue(res)
  return res
}

function mockNext() {
  return vi.fn()
}

describe('authMiddleware', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return 401 if no authorization header', async () => {
    const req: any = { headers: {} }
    const res = mockResponse()
    const next = mockNext()

    await authMiddleware(req, res, next)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({ error: 'Missing Authorization header' })
    expect(next).not.toHaveBeenCalled()
  })

  it('should call next and set user on valid token', async () => {
    const req: any = { headers: { authorization: 'Bearer valid-token' } }
    const res = mockResponse()
    const next = mockNext()

    await authMiddleware(req, res, next)

    expect(req.user).toBeDefined()
    expect(req.user.uid).toBe('test-user-123')
    expect(next).toHaveBeenCalled()
  })

  it('should return 401 if there is an error in the auth process', async () => {
    const req: any = { headers: { authorization: 'Bearer some-token' } }
    const res = mockResponse()
    const next = mockNext()

    // Make the verifyIdToken throw to test the .catch() path in the middleware
    const admin = await import('firebase-admin')
    const authFn = admin.auth as any
    const authInstance = authFn()
    authInstance.verifyIdToken.mockRejectedValueOnce(new Error('Auth failed'))

    await authMiddleware(req, res, next)

    expect(res.status).toHaveBeenCalledWith(401)
    // The middleware catches the error, returns null from .catch(), then checks !decoded
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid token' })
  })
})