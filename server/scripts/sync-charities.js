/**
 * Pull charities from Charity Navigator and upsert into andale_db.charities.
 *
 * Usage (from server/):
 *   npm run sync:charities
 *   npm run sync:charities -- --limit=50
 *
 * Requires CHARITY_NAVIGATOR_API_KEY in server/.env
 * Get a key: https://developer.charitynavigator.org/
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') })
const mysql = require('mysql')
const { fetchCharitiesForSync, getApiKey } = require('../charityNavigator')

const dbName = process.env.DB_NAME || 'andale_db'
const dbHost = process.env.DB_HOST === 'localhost' || !process.env.DB_HOST
  ? '127.0.0.1'
  : process.env.DB_HOST

const limitArg = process.argv.find((a) => a.startsWith('--limit='))
const limit = limitArg ? Number(limitArg.split('=')[1]) : Number(process.env.CN_SYNC_LIMIT || 100)

const columns = [
  'charityid',
  'charity_name',
  'overall_score',
  'financial_score',
  'accountability_score',
  'city',
  'state',
  'size',
  'type1',
  'type2',
  'total_contributions',
  'excess',
  'net_assets',
  'other_revenue',
  'program_expenses',
  'administrative_expenses',
  'fundraising_expenses',
  'admin_expense_ratio',
  'charity_url',
  'payments_to_affiliates',
]

const connection = mysql.createConnection({
  host: dbHost,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  multipleStatements: true,
})

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    connection.query(sql, params, (err, result) => {
      if (err) reject(err)
      else resolve(result)
    })
  })
}

async function ensureSchema() {
  await run(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``)
  await run(`USE \`${dbName}\``)
  await run(`
    CREATE TABLE IF NOT EXISTS charities (
      charityid INT NOT NULL PRIMARY KEY,
      charity_name VARCHAR(255) NOT NULL,
      overall_score DECIMAL(5,2) NOT NULL DEFAULT 0,
      financial_score DECIMAL(5,2) NOT NULL DEFAULT 0,
      accountability_score DECIMAL(5,2) NOT NULL DEFAULT 0,
      city VARCHAR(100) DEFAULT NULL,
      state VARCHAR(50) DEFAULT NULL,
      size VARCHAR(20) DEFAULT NULL,
      type1 VARCHAR(50) DEFAULT NULL,
      type2 VARCHAR(100) DEFAULT NULL,
      total_contributions BIGINT DEFAULT 0,
      excess BIGINT DEFAULT 0,
      net_assets BIGINT DEFAULT 0,
      other_revenue BIGINT DEFAULT 0,
      program_expenses BIGINT DEFAULT 0,
      administrative_expenses BIGINT DEFAULT 0,
      fundraising_expenses BIGINT DEFAULT 0,
      admin_expense_ratio DECIMAL(8,4) DEFAULT 0,
      charity_url VARCHAR(255) DEFAULT NULL,
      payments_to_affiliates BIGINT DEFAULT 0
    )
  `)
  await run(`
    CREATE TABLE IF NOT EXISTS archive (
      userid VARCHAR(64) NOT NULL,
      charityid INT NOT NULL,
      figure DECIMAL(10,2) DEFAULT 0,
      isfavorite TINYINT(1) DEFAULT 0,
      date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (userid, charityid)
    )
  `)
}

async function upsertCharity(row) {
  const placeholders = columns.map(() => '?').join(', ')
  const updates = columns
    .filter((c) => c !== 'charityid')
    .map((c) => `${c}=VALUES(${c})`)
    .join(', ')
  const values = columns.map((c) => row[c])
  await run(
    `INSERT INTO charities (${columns.join(', ')}) VALUES (${placeholders})
     ON DUPLICATE KEY UPDATE ${updates}`,
    values
  )
}

async function main() {
  if (!getApiKey()) {
    console.error('Missing CHARITY_NAVIGATOR_API_KEY in server/.env')
    console.error('Create one at https://developer.charitynavigator.org/')
    process.exit(1)
  }

  console.log(`Fetching up to ${limit} rated charities from Charity Navigator...`)
  const rows = await fetchCharitiesForSync(limit)
  console.log(`Mapped ${rows.length} organizations. Writing to MySQL...`)

  await ensureSchema()
  for (const row of rows) {
    await upsertCharity(row)
  }

  const count = await run('SELECT COUNT(*) AS total FROM charities')
  const sample = await run(
    'SELECT charityid, charity_name, overall_score, type1, size, city, state FROM charities ORDER BY overall_score DESC LIMIT 5'
  )
  console.log(`Done. charities table has ${count[0].total} rows.`)
  console.log('Top sample:')
  sample.forEach((r) => {
    console.log(`  ${r.overall_score}  ${r.charity_name}  [${r.type1}/${r.size}]  ${r.city}, ${r.state}`)
  })
  connection.end()
}

main().catch((err) => {
  console.error('Sync failed:', err.code || '', err.message)
  if (err.payload) console.error(JSON.stringify(err.payload, null, 2))
  connection.end()
  process.exit(1)
})
