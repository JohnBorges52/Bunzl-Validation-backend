// Database connections
const { Pool } = require('pg');

const { RAILWAY_CONNECTION_URL } = process.env;

const pool = new Pool({
  RAILWAY_CONNECTION_URL: RAILWAY_CONNECTION_URL,

})

pool.connect().then(() => {
  console.log("Database connection established.")
}).catch(e => {
  throw new Error(e);
})

module.exports = pool;
