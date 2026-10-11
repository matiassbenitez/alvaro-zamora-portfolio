const KEY = 'visitor_token'

export function getVisitorToken() {
  let token = localStorage.getItem(KEY)
  if (!token) {
    token =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `visitor-${Date.now()}-${Math.random().toString(36).slice(2)}`
    localStorage.setItem(KEY, token)
  }
  return token
}
