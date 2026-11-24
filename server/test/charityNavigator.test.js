const { describe, it } = require('node:test')
const assert = require('node:assert/strict')
const { mapToCharityRow, mapSize, mapType1 } = require('../charityNavigator')

describe('charityNavigator mapping', () => {
  it('maps CN size bands onto Small/Mid/Large', () => {
    assert.equal(mapSize('MICRO'), 'Small')
    assert.equal(mapSize('SMALL'), 'Small')
    assert.equal(mapSize('MEDIUM'), 'Mid')
    assert.equal(mapSize('LARGE'), 'Large')
    assert.equal(mapSize('SUPER'), 'Large')
  })

  it('maps causes onto catalog type1 values', () => {
    assert.equal(mapType1(['Wildlife protection']), 'Animals')
    assert.equal(mapType1(['Elementary education']), 'Education')
    assert.equal(mapType1(['Clean water supply']), 'Environment')
    assert.equal(mapType1(['Mental health care']), 'Healthcare')
    assert.equal(mapType1(['Civil rights']), 'Human')
  })

  it('maps a CN search result into the local charities row shape', () => {
    const row = mapToCharityRow({
      ein: '63-1135091',
      name: 'Equal Justice Initiative',
      mission: 'Civil rights advocacy and justice reform',
      size: 'LARGE',
      organization_url: 'https://eji.org',
      charity_navigator_url: 'https://www.charitynavigator.org/ein/631135091',
      encompass_score: '98.5',
      encompass_star_rating: '4',
      city: 'Montgomery',
      state: 'AL',
      causes: ['Civil rights', 'Legal services'],
    })

    assert.equal(row.charityid, 631135091)
    assert.equal(row.charity_name, 'Equal Justice Initiative')
    assert.equal(row.overall_score, 98.5)
    assert.equal(row.financial_score, 98.5)
    assert.equal(row.accountability_score, 98.5)
    assert.equal(row.city, 'Montgomery')
    assert.equal(row.state, 'AL')
    assert.equal(row.size, 'Large')
    assert.equal(row.type1, 'Human')
    assert.equal(row.type2, 'Civil rights')
    assert.equal(row.charity_url, 'https://eji.org')
    assert.equal(row.program_expenses, 0)
  })
})
