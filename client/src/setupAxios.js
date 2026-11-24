import axios from 'axios'
import { Auth } from 'aws-amplify'
import { DEMO_USER, isDemoMode, isDemoSession } from './demoAuth'

/**
 * Attach Cognito ID token, or demo auth headers when REACT_APP_DEMO_MODE is on.
 */
axios.interceptors.request.use(async (config) => {
  config.headers = config.headers || {}

  if (isDemoMode() && isDemoSession()) {
    config.headers['X-Demo-User'] = DEMO_USER.username
    config.headers.Authorization = 'Bearer demo'
    return config
  }

  try {
    const session = await Auth.currentSession()
    const token = session.getIdToken().getJwtToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  } catch (_) {
    // Unauthenticated requests (catalog, landing, etc.) proceed without a token
  }
  return config
})
