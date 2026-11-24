const { describe, it } = require('node:test')
const assert = require('node:assert/strict')
const { stripSensitive, clampString, parsePositiveInt } = require('../sanitize')

describe('stripSensitive', () => {
  it('removes password from a user row', () => {
    const row = { userid: '1', username: 'alice', password: 'secret' }
    assert.deepEqual(stripSensitive(row), { userid: '1', username: 'alice' })
  })

  it('removes password from an array of rows', () => {
    const rows = [
      { userid: '1', password: 'a' },
      { userid: '2', password: 'b' },
    ]
    const cleaned = stripSensitive(rows)
    assert.equal(cleaned[0].password, undefined)
    assert.equal(cleaned[1].password, undefined)
    assert.equal(cleaned[0].userid, '1')
  })
})

describe('clampString', () => {
  it('truncates long strings', () => {
    assert.equal(clampString('abcdef', 3), 'abc')
  })
})

describe('parsePositiveInt', () => {
  it('accepts amounts in range', () => {
    assert.equal(parsePositiveInt(500, { min: 50, max: 999 }), 500)
  })

  it('rejects out of range', () => {
    assert.equal(parsePositiveInt(10, { min: 50, max: 999 }), null)
  })
})
