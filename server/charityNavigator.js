/**
 * Charity Navigator Data API client (GraphQL).
 * Docs: https://developer.charitynavigator.org/
 *
 * Auth: Authorization: Bearer <CHARITY_NAVIGATOR_API_KEY>
 * Endpoint: https://api.charitynavigator.org/graphql
 *
 * Note: Form 990 line-item fields (program/admin/fundraising expenses, etc.)
 * are not yet exposed on the public search result type. Those map to 0 until
 * CN ships evaluation-area / raw metrics in the API.
 */

const CN_API_URL = process.env.CHARITY_NAVIGATOR_API_URL || 'https://api.charitynavigator.org/graphql'

const SEARCH_QUERY = `
  query PublicSearchFaceted(
    $term: String!
    $states: [String!]!
    $sizes: [String!]!
    $causes: [String!]!
    $ratings: [String!]!
    $is_rated: Boolean
    $c3: Boolean!
    $result_size: Int!
    $from: Int!
    $order_by: String!
  ) {
    publicSearchFaceted(
      term: $term
      states: $states
      sizes: $sizes
      causes: $causes
      ratings: $ratings
      is_rated: $is_rated
      c3: $c3
      result_size: $result_size
      from: $from
      order_by: $order_by
    ) {
      result_count
      from
      size
      results {
        ein
        name
        mission
        size
        organization_url
        charity_navigator_url
        encompass_score
        encompass_star_rating
        city
        state
        country
        causes
      }
    }
  }
`

function getApiKey() {
  return process.env.CHARITY_NAVIGATOR_API_KEY || process.env.API_KEY || ''
}

async function graphqlRequest(query, variables = {}) {
  const apiKey = getApiKey()
  if (!apiKey) {
    const err = new Error(
      'CHARITY_NAVIGATOR_API_KEY is not set. Create a key at https://developer.charitynavigator.org/ and add it to server/.env'
    )
    err.code = 'CN_API_KEY_MISSING'
    throw err
  }

  const res = await fetch(CN_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ query, variables }),
  })

  const payload = await res.json().catch(() => ({}))
  if (!res.ok) {
    const err = new Error(
      payload.message || payload.error || `Charity Navigator HTTP ${res.status}`
    )
    err.code = 'CN_HTTP_ERROR'
    err.status = res.status
    err.payload = payload
    throw err
  }
  if (payload.errors && payload.errors.length) {
    const err = new Error(payload.errors.map((e) => e.message).join('; '))
    err.code = 'CN_GRAPHQL_ERROR'
    err.payload = payload.errors
    throw err
  }
  return payload.data
}

function mapSize(cnSize) {
  const value = String(cnSize || '').toUpperCase()
  if (value === 'MICRO' || value === 'SMALL') return 'Small'
  if (value === 'MEDIUM') return 'Mid'
  if (value === 'LARGE' || value === 'SUPER') return 'Large'
  return 'Mid'
}

function mapType1(causes = [], mission = '') {
  const haystack = `${(causes || []).join(' ')} ${mission || ''}`.toLowerCase()
  const rules = [
    ['Animals', [/animal/, /wildlife/, /pet\b/, /zoo/, /species/]],
    ['Environment', [/environment/, /conserv/, /climate/, /ecology/, /park/, /garden/, /water supply/, /pollution/]],
    ['Education', [/educat/, /school/, /scholarship/, /literacy/, /university/, /student/]],
    ['Healthcare', [/health/, /hospital/, /medical/, /disease/, /cancer/, /clinic/, /mental health/]],
    ['Research', [/research/, /science/, /policy/, /think tank/]],
    ['Human', [/human right/, /civil right/, /shelter/, /homeless/, /crisis/, /justice/, /hunger/, /poverty/, /social service/, /youth development/]],
    ['Community', [/community/, /neighborhood/, /food bank/, /local/, /family service/]],
  ]
  for (const [type, patterns] of rules) {
    if (patterns.some((re) => re.test(haystack))) return type
  }
  return 'Community'
}

function parseScore(value) {
  const n = parseFloat(value)
  if (Number.isFinite(n)) return Math.max(0, Math.min(100, n))
  return 0
}

function einToId(ein) {
  const digits = String(ein || '').replace(/\D/g, '')
  if (!digits) return null
  const id = Number(digits)
  return Number.isFinite(id) ? id : null
}

/**
 * Map a Charity Navigator search result into the local `charities` row shape.
 */
function mapToCharityRow(result) {
  const charityid = einToId(result.ein)
  if (!charityid || !result.name) return null

  const score = parseScore(result.encompass_score)
  const causes = Array.isArray(result.causes) ? result.causes : []
  const type1 = mapType1(causes, result.mission)
  const type2 = causes[0] || (result.mission ? String(result.mission).slice(0, 100) : 'General')

  return {
    charityid,
    charity_name: String(result.name).slice(0, 255),
    overall_score: score,
    // Separate Finance / Accountability beacons are not on publicSearchFaceted yet.
    financial_score: score,
    accountability_score: score,
    city: result.city || '',
    state: result.state || '',
    size: mapSize(result.size),
    type1,
    type2: String(type2).slice(0, 100),
    total_contributions: 0,
    excess: 0,
    net_assets: 0,
    other_revenue: 0,
    program_expenses: 0,
    administrative_expenses: 0,
    fundraising_expenses: 0,
    admin_expense_ratio: 0,
    charity_url: result.organization_url || result.charity_navigator_url || '',
    payments_to_affiliates: 0,
    // Extra metadata kept for sync/debug (not required by UI)
    _ein: String(result.ein || '').replace(/\D/g, ''),
    _star_rating: result.encompass_star_rating || null,
    _mission: result.mission || '',
  }
}

/**
 * Fetch one page of high-rated nonprofits from Charity Navigator.
 */
async function searchCharities(options = {}) {
  const variables = {
    term: options.term || '',
    states: options.states || [],
    sizes: options.sizes || [],
    causes: options.causes || [],
    ratings: options.ratings || ['3', '4'],
    is_rated: options.is_rated !== undefined ? options.is_rated : true,
    c3: options.c3 !== undefined ? options.c3 : true,
    result_size: options.result_size || 25,
    from: options.from || 0,
    order_by: options.order_by || 'rating',
  }

  const data = await graphqlRequest(SEARCH_QUERY, variables)
  const page = data.publicSearchFaceted || { results: [], result_count: 0, from: 0 }
  return {
    result_count: page.result_count || 0,
    from: page.from || 0,
    results: (page.results || []).map(mapToCharityRow).filter(Boolean),
    raw: page.results || [],
  }
}

/**
 * Page through Charity Navigator search until `limit` mapped rows are collected.
 */
async function fetchCharitiesForSync(limit = 100) {
  const pageSize = 25
  const collected = []
  const seen = new Set()
  let from = 0
  let resultCount = Infinity

  while (collected.length < limit && from < resultCount) {
    const page = await searchCharities({
      ratings: ['3', '4'],
      is_rated: true,
      c3: true,
      result_size: pageSize,
      from,
      order_by: 'rating',
    })
    resultCount = page.result_count || 0
    if (!page.results.length) break

    for (const row of page.results) {
      if (seen.has(row.charityid)) continue
      seen.add(row.charityid)
      collected.push(row)
      if (collected.length >= limit) break
    }
    from += pageSize
  }

  return collected
}

module.exports = {
  getApiKey,
  searchCharities,
  fetchCharitiesForSync,
  mapToCharityRow,
  mapSize,
  mapType1,
}
