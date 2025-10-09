import { Request, Response, NextFunction } from "express"
import admin from "firebase-admin"

export interface AuthRequest extends Request {
  user?: admin.auth.DecodedIdToken
}

export async function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader) return res.status(401).json({ error: 'Missing Authorization header' })
    const token = authHeader.replace('Bearer ', '')
    const decoded = await admin.auth().verifyIdToken(token).catch(() => null)
    if (!decoded) return res.status(401).json({ error: 'Invalid token' })
    req.user = decoded
    next()
  } catch (err) {
    console.error('Auth error', err)
    return res.status(401).json({ error: 'Authentication failed' })
  }
}
