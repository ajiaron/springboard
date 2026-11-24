const { CognitoJwtVerifier } = require('aws-jwt-verify');

let verifier = null;

function getVerifier() {
  if (verifier) return verifier;
  const userPoolId = process.env.COGNITO_USER_POOL_ID;
  const clientId = process.env.COGNITO_CLIENT_ID;
  if (!userPoolId || !clientId) {
    return null;
  }
  verifier = CognitoJwtVerifier.create({
    userPoolId,
    tokenUse: 'id',
    clientId,
  });
  return verifier;
}

function usernameFromPayload(payload) {
  return payload['cognito:username'] || payload.username || null;
}

const DEMO_USERNAME = process.env.DEMO_USERNAME || 'demo';
const DEMO_USER_ID = process.env.DEMO_USER_ID || '00000000-0000-4000-8000-000000000001';

function isDemoModeEnabled() {
  return process.env.DEMO_MODE === 'true' || process.env.NODE_ENV === 'test';
}

/**
 * Requires a valid Cognito ID token in Authorization: Bearer <token>.
 * Demo/test: accepts X-Demo-User / X-Test-Username when DEMO_MODE=true (or NODE_ENV=test).
 */
async function requireAuth(req, res, next) {
  if (isDemoModeEnabled()) {
    const demoUser = req.headers['x-demo-user'] || req.headers['x-test-username'];
    if (demoUser && String(demoUser) === DEMO_USERNAME) {
      req.authUsername = DEMO_USERNAME;
      req.isDemoAuth = true;
      return next();
    }
    // Also accept Bearer demo for simple manual testing
    const header = req.headers.authorization || '';
    if (header === 'Bearer demo') {
      req.authUsername = DEMO_USERNAME;
      req.isDemoAuth = true;
      return next();
    }
  }

  if (process.env.NODE_ENV === 'test' && req.headers['x-test-username']) {
    req.authUsername = String(req.headers['x-test-username']);
    return next();
  }

  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = header.slice(7).trim();
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const jwtVerifier = getVerifier();
  if (!jwtVerifier) {
    console.error('Cognito verifier not configured (COGNITO_USER_POOL_ID / COGNITO_CLIENT_ID)');
    return res.status(500).json({ error: 'Auth not configured' });
  }

  try {
    const payload = await jwtVerifier.verify(token);
    const username = usernameFromPayload(payload);
    if (!username) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    req.auth = payload;
    req.authUsername = username;
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
}

/**
 * Loads the MySQL userid for the authenticated Cognito username onto req.userId.
 * In demo mode, falls back to DEMO_USER_ID when the DB user is missing.
 */
function resolveUser(db) {
  return (req, res, next) => {
    if (!req.authUsername) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (req.isDemoAuth && isDemoModeEnabled()) {
      req.userId = DEMO_USER_ID;
      return next();
    }

    db.query(
      'SELECT userid FROM users WHERE username = ? LIMIT 1',
      [req.authUsername],
      (err, rows) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Server error' });
        }
        if (!rows || rows.length === 0) {
          if (isDemoModeEnabled() && req.authUsername === DEMO_USERNAME) {
            req.userId = DEMO_USER_ID;
            return next();
          }
          return res.status(401).json({ error: 'Unauthorized' });
        }
        req.userId = rows[0].userid;
        return next();
      }
    );
  };
}

/**
 * Ensures a client-supplied user id matches the authenticated user.
 */
function assertSelf(req, res, candidateId) {
  if (candidateId === undefined || candidateId === null || candidateId === '') {
    return false;
  }
  if (String(candidateId) !== String(req.userId)) {
    res.status(403).json({ error: 'Forbidden' });
    return false;
  }
  return true;
}

module.exports = {
  requireAuth,
  resolveUser,
  assertSelf,
  usernameFromPayload,
};
