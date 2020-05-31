const { Pool } = require('pg');

class Database {
  constructor(dbConfig) {
    this.pool = new Pool(dbConfig);
  }

  runQuery(query, params) {
    return this.pool.query(query, params);
  }
}

module.exports = Database;
