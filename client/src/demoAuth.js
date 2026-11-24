/**
 * Local demonstration auth — used when Amplify/Cognito is unavailable.
 * Enabled only when REACT_APP_DEMO_MODE=true.
 */

export const DEMO_USER = {
  userid: '00000000-0000-4000-8000-000000000001',
  username: 'demo',
  password: 'demo',
  email: 'demo@springboard.local',
  firstname: 'Demo',
  lastname: 'User',
}

export function isDemoMode() {
  return process.env.REACT_APP_DEMO_MODE === 'true'
}

export function isDemoSession() {
  try {
    return localStorage.getItem('demoSession') === 'true'
  } catch (_) {
    return false
  }
}

export function ensureDemoSession() {
  localStorage.setItem('demoSession', 'true')
  localStorage.setItem('userid', JSON.stringify(DEMO_USER.userid))
  localStorage.setItem('username', JSON.stringify(DEMO_USER.username))
  localStorage.setItem('email', JSON.stringify(DEMO_USER.email))
  localStorage.setItem('firstname', JSON.stringify(DEMO_USER.firstname))
  localStorage.setItem('lastname', JSON.stringify(DEMO_USER.lastname))
  return DEMO_USER
}

export function clearDemoSession() {
  localStorage.removeItem('demoSession')
  localStorage.removeItem('userid')
  localStorage.removeItem('username')
  localStorage.removeItem('email')
  localStorage.removeItem('firstname')
  localStorage.removeItem('lastname')
}

export function matchesDemoCredentials(username, password) {
  return (
    String(username).trim().toLowerCase() === DEMO_USER.username &&
    String(password) === DEMO_USER.password
  )
}

/** True when demo mode is on and a demo session is active (or being established). */
export function isDemoAuthenticated() {
  return isDemoMode() && isDemoSession()
}
