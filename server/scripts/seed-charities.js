/**
 * Seed sample charity rows for local testing.
 * Usage (from server/): node scripts/seed-charities.js
 *
 * Creates andale_db + charities table if missing, then upserts seed rows.
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') })
const mysql = require('mysql')

const dbName = process.env.DB_NAME || 'andale_db'

// Prefer 127.0.0.1 over "localhost" so Node does not try IPv6 (::1) against Docker-mapped MySQL.
const dbHost = process.env.DB_HOST === 'localhost' || !process.env.DB_HOST
  ? '127.0.0.1'
  : process.env.DB_HOST

const connection = mysql.createConnection({
  host: dbHost,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  multipleStatements: true,
})

const charities = [
  {
    charityid: 1,
    charity_name: 'Equal Justice Initiative',
    overall_score: 100.0,
    financial_score: 100.0,
    accountability_score: 100.0,
    city: 'Montgomery',
    state: 'AL',
    size: 'Large',
    type1: 'Human',
    type2: 'Civil Rights Advocacy',
    total_contributions: 58200000,
    excess: 12400000,
    net_assets: 312000000,
    other_revenue: 2100000,
    program_expenses: 41000000,
    administrative_expenses: 3200000,
    fundraising_expenses: 1800000,
    admin_expense_ratio: 0.055,
    charity_url: 'https://eji.org',
    payments_to_affiliates: 0,
  },
  {
    charityid: 2,
    charity_name: 'Kids In Need Foundation',
    overall_score: 98.2,
    financial_score: 97.5,
    accountability_score: 100.0,
    city: 'Roseville',
    state: 'MN',
    size: 'Mid',
    type1: 'Education',
    type2: 'School Supply Support',
    total_contributions: 18400000,
    excess: 920000,
    net_assets: 8600000,
    other_revenue: 340000,
    program_expenses: 16900000,
    administrative_expenses: 36800,
    fundraising_expenses: 410000,
    admin_expense_ratio: 0.002,
    charity_url: 'https://www.kinf.org',
    payments_to_affiliates: 0,
  },
  {
    charityid: 3,
    charity_name: 'American Heart Association',
    overall_score: 91.4,
    financial_score: 88.6,
    accountability_score: 97.0,
    city: 'Dallas',
    state: 'TX',
    size: 'Large',
    type1: 'Healthcare',
    type2: 'Cardiovascular Health',
    total_contributions: 693000000,
    excess: 42000000,
    net_assets: 1180000000,
    other_revenue: 87000000,
    program_expenses: 548000000,
    administrative_expenses: 62000000,
    fundraising_expenses: 78000000,
    admin_expense_ratio: 0.089,
    charity_url: 'https://www.heart.org',
    payments_to_affiliates: 1200000,
  },
  {
    charityid: 4,
    charity_name: 'Conservation International',
    overall_score: 97.8,
    financial_score: 94.1,
    accountability_score: 100.0,
    city: 'Arlington',
    state: 'VA',
    size: 'Large',
    type1: 'Environment',
    type2: 'Biodiversity Conservation',
    total_contributions: 186000000,
    excess: 15500000,
    net_assets: 268000000,
    other_revenue: 9200000,
    program_expenses: 142000000,
    administrative_expenses: 14800000,
    fundraising_expenses: 11200000,
    admin_expense_ratio: 0.08,
    charity_url: 'https://www.conservation.org',
    payments_to_affiliates: 0,
  },
  {
    charityid: 5,
    charity_name: 'Direct Relief',
    overall_score: 100.0,
    financial_score: 100.0,
    accountability_score: 100.0,
    city: 'Santa Barbara',
    state: 'CA',
    size: 'Large',
    type1: 'Healthcare',
    type2: 'Medical Aid',
    total_contributions: 2100000000,
    excess: 48000000,
    net_assets: 920000000,
    other_revenue: 15000000,
    program_expenses: 1980000000,
    administrative_expenses: 18000000,
    fundraising_expenses: 9000000,
    admin_expense_ratio: 0.009,
    charity_url: 'https://www.directrelief.org',
    payments_to_affiliates: 0,
  },
  {
    charityid: 6,
    charity_name: 'World Wildlife Fund',
    overall_score: 90.5,
    financial_score: 87.2,
    accountability_score: 96.0,
    city: 'Washington',
    state: 'DC',
    size: 'Large',
    type1: 'Animals',
    type2: 'Wildlife Protection',
    total_contributions: 312000000,
    excess: 22000000,
    net_assets: 540000000,
    other_revenue: 28000000,
    program_expenses: 248000000,
    administrative_expenses: 26000000,
    fundraising_expenses: 32000000,
    admin_expense_ratio: 0.083,
    charity_url: 'https://www.worldwildlife.org',
    payments_to_affiliates: 450000,
  },
  {
    charityid: 7,
    charity_name: 'DonorsChoose',
    overall_score: 95.6,
    financial_score: 93.8,
    accountability_score: 100.0,
    city: 'New York',
    state: 'NY',
    size: 'Mid',
    type1: 'Education',
    type2: 'Classroom Project Funding',
    total_contributions: 98000000,
    excess: 4100000,
    net_assets: 42000000,
    other_revenue: 2600000,
    program_expenses: 82000000,
    administrative_expenses: 5400000,
    fundraising_expenses: 3800000,
    admin_expense_ratio: 0.055,
    charity_url: 'https://www.donorschoose.org',
    payments_to_affiliates: 0,
  },
  {
    charityid: 8,
    charity_name: 'Habitat for Humanity International',
    overall_score: 92.1,
    financial_score: 89.4,
    accountability_score: 97.0,
    city: 'Americus',
    state: 'GA',
    size: 'Large',
    type1: 'Human',
    type2: 'Housing & Shelter',
    total_contributions: 265000000,
    excess: 18000000,
    net_assets: 410000000,
    other_revenue: 31000000,
    program_expenses: 214000000,
    administrative_expenses: 21000000,
    fundraising_expenses: 24000000,
    admin_expense_ratio: 0.079,
    charity_url: 'https://www.habitat.org',
    payments_to_affiliates: 890000,
  },
  {
    charityid: 9,
    charity_name: 'Trevor Project',
    overall_score: 96.3,
    financial_score: 94.7,
    accountability_score: 100.0,
    city: 'West Hollywood',
    state: 'CA',
    size: 'Mid',
    type1: 'Human',
    type2: 'Crisis Services',
    total_contributions: 72000000,
    excess: 8500000,
    net_assets: 61000000,
    other_revenue: 1200000,
    program_expenses: 52000000,
    administrative_expenses: 4800000,
    fundraising_expenses: 4200000,
    admin_expense_ratio: 0.067,
    charity_url: 'https://www.thetrevorproject.org',
    payments_to_affiliates: 0,
  },
  {
    charityid: 10,
    charity_name: 'Local Community Food Bank',
    overall_score: 93.0,
    financial_score: 91.2,
    accountability_score: 97.0,
    city: 'Riverside',
    state: 'CA',
    size: 'Small',
    type1: 'Community',
    type2: 'Food Security',
    total_contributions: 2400000,
    excess: 180000,
    net_assets: 1100000,
    other_revenue: 95000,
    program_expenses: 1980000,
    administrative_expenses: 145000,
    fundraising_expenses: 120000,
    admin_expense_ratio: 0.06,
    charity_url: 'https://example.org/local-food-bank',
    payments_to_affiliates: 0,
  },
  {
    charityid: 11,
    charity_name: 'Open Source Foundation',
    overall_score: 94.8,
    financial_score: 92.0,
    accountability_score: 100.0,
    city: 'San Francisco',
    state: 'CA',
    size: 'Small',
    type1: 'Research',
    type2: 'Public Technology Policy',
    total_contributions: 5600000,
    excess: 640000,
    net_assets: 4200000,
    other_revenue: 310000,
    program_expenses: 4300000,
    administrative_expenses: 380000,
    fundraising_expenses: 220000,
    admin_expense_ratio: 0.068,
    charity_url: 'https://example.org/open-source-foundation',
    payments_to_affiliates: 0,
  },
  {
    charityid: 12,
    charity_name: 'City Parks Conservancy',
    overall_score: 91.7,
    financial_score: 90.1,
    accountability_score: 96.0,
    city: 'Chicago',
    state: 'IL',
    size: 'Small',
    type1: 'Environment',
    type2: 'Urban Parks & Gardens',
    total_contributions: 1800000,
    excess: 210000,
    net_assets: 950000,
    other_revenue: 78000,
    program_expenses: 1420000,
    administrative_expenses: 110000,
    fundraising_expenses: 95000,
    admin_expense_ratio: 0.061,
    charity_url: 'https://example.org/city-parks',
    payments_to_affiliates: 0,
  },
]

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

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    connection.query(sql, params, (err, result) => {
      if (err) reject(err)
      else resolve(result)
    })
  })
}

async function main() {
  console.log(`Connecting to ${dbHost} as ${process.env.DB_USER || 'root'}...`)
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

  const placeholders = columns.map(() => '?').join(', ')
  const updates = columns
    .filter((c) => c !== 'charityid')
    .map((c) => `${c}=VALUES(${c})`)
    .join(', ')

  for (const row of charities) {
    const values = columns.map((c) => row[c])
    await run(
      `INSERT INTO charities (${columns.join(', ')}) VALUES (${placeholders})
       ON DUPLICATE KEY UPDATE ${updates}`,
      values
    )
  }

  const count = await run('SELECT COUNT(*) AS total FROM charities')
  console.log(`Seeded ${charities.length} charities. Table now has ${count[0].total} rows.`)
  connection.end()
}

main().catch((err) => {
  console.error('Seed failed:', err.code || '', err.message)
  console.error('Start MySQL (or Docker), confirm server/.env DB_* values, then retry.')
  connection.end()
  process.exit(1)
})
