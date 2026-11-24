/**
 * Remove sensitive fields from user row objects before sending to clients.
 */
function stripSensitive(data) {
  if (data == null) return data;
  const stripOne = (row) => {
    if (!row || typeof row !== 'object' || Array.isArray(row)) return row;
    const copy = { ...row };
    delete copy.password;
    return copy;
  };
  return Array.isArray(data) ? data.map(stripOne) : stripOne(data);
}

const USER_PUBLIC_COLUMNS =
  'users.userid, users.username, users.firstname, users.lastname, users.email, users.bio, users.location, users.social, users.profilepic, users.public, users.accountid, users.payouts, users.charges, users.confirmed';

function clampString(value, maxLen) {
  if (value == null) return value;
  const s = String(value);
  return s.length > maxLen ? s.slice(0, maxLen) : s;
}

function isValidUuid(value) {
  return typeof value === 'string' &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function parsePositiveInt(value, { min = 1, max = Number.MAX_SAFE_INTEGER } = {}) {
  const n = Number(value);
  if (!Number.isFinite(n) || !Number.isInteger(n) || n < min || n > max) {
    return null;
  }
  return n;
}

module.exports = {
  stripSensitive,
  USER_PUBLIC_COLUMNS,
  clampString,
  isValidUuid,
  parsePositiveInt,
};
