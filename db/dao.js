const { Pool } = require("pg");

class Database {
  constructor(db_config) {
    this.pool = new Pool(db_config);
  }

  runQuery(query, params) {
    return this.pool.query(query, params);
  }
}

module.exports = { Database };
