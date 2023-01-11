// Database connections
const { Pool } = require('pg');

const { DATABASE_URL, PGDATABASE, PGHOST, PGPASSWORD, PGPORT, PGUSER } = process.env;

const pool = new Pool({
  DATABASE_URL: DATABASE_URL,
  PGDATABASE: PGDATABASE,
  PGHOST: PGHOST,
  PGPASSORD: PGPASSWORD,
  PGPORT: PGPORT,
  PGUSER: PGUSER,

})

pool.connect().then(() => {
  console.log("Database connection established.")
}).catch(e => {
  throw new Error(e);
})

module.exports = pool;
