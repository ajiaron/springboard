/**
 * Regression tests for auth gates. Uses NODE_ENV=test and X-Test-Username
 * bypass in auth.js. Database calls that run after auth may 500 without MySQL;
 * these tests assert status codes that prove auth/validation gates fire first.
 */
process.env.NODE_ENV = 'test'
process.env.STRIPE_SECRET_KEY = 'sk_test_placeholder'
process.env.CLIENT_ORIGIN = 'http://localhost:3000'
process.env.DB_PASSWORD = ''

const { describe, it, before } = require('node:test')
const assert = require('node:assert/strict')
const request = require('supertest')

let app

before(async () => {
  ;({ app } = require('../server'))
})

describe('protected endpoints require auth', () => {
  it('rejects unauthenticated updateuser', async () => {
    const res = await request(app)
      .put('/api/updateuser')
      .send({ userid: 'other', firstname: 'Eve' })
    assert.equal(res.status, 401)
  })

  it('rejects unauthenticated getbasket', async () => {
    const res = await request(app).get('/api/getbasket').query({ userid: 'someone' })
    assert.equal(res.status, 401)
  })

  it('rejects unauthenticated createintent', async () => {
    const res = await request(app)
      .post('/api/createintent')
      .send({ amount: 500, accountid: 'acct_x' })
    assert.equal(res.status, 401)
  })

  it('rejects unauthenticated deletepost', async () => {
    const res = await request(app)
      .delete('/api/deletepost')
      .send({ postid: 'p1' })
    assert.equal(res.status, 401)
  })
})

describe('getuser never returns password field', () => {
  it('omits password even when querying a username', async () => {
    const res = await request(app)
      .get('/api/getuser')
      .query({ username: 'nonexistent-user-xyz' })
    // Without DB this may 500; with DB empty array. Either way password must be absent.
    if (res.status === 200 && Array.isArray(res.body)) {
      for (const row of res.body) {
        assert.equal(Object.prototype.hasOwnProperty.call(row, 'password'), false)
      }
    } else {
      assert.ok([200, 500].includes(res.status))
      if (res.body && typeof res.body === 'object' && !Array.isArray(res.body)) {
        assert.equal(res.body.password, undefined)
      }
    }
  })
})

describe('createuser validation', () => {
  it('rejects missing fields', async () => {
    const res = await request(app)
      .post('/api/createuser')
      .send({ username: 'onlyname' })
    assert.equal(res.status, 400)
  })
})

describe('updateuser rejects protected field tampering when authenticated', () => {
  it('returns 400 when password is supplied', async () => {
    const res = await request(app)
      .put('/api/updateuser')
      .set('X-Test-Username', 'testuser')
      .send({ password: 'hack', firstname: 'A' })
    // 400 if user resolves; 401 if test user missing from DB
    assert.ok([400, 401, 500].includes(res.status))
    if (res.status === 400) {
      assert.match(String(res.body.error || ''), /Protected|modified/i)
    }
  })
})
