import { auth } from '@/lib/firebase' // adjust path

const API_BASE = import.meta.env.VITE_API_URL ?? ''

async function apiFetch(path: string, opts: RequestInit = {}) {
  const token = await auth.currentUser?.getIdToken().catch(() => null)
  const res = await fetch(`${API_BASE}/api${path}`, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
      ...((opts && opts.headers) || {}),
    },
    credentials: 'include',
    body: opts.body,
  })

  const text = await res.text()
  let json: any = null
  try { json = text ? JSON.parse(text) : null } catch { }
  if (!res.ok) {
    const msg = json?.error || json?.message || `API error ${res.status}`
    throw new Error(msg)
  }
  return json
}

export default apiFetch