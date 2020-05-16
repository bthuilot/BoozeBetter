const { readConfigFiles } = require('../config/config');

const data = readConfigFiles().db;
const { user, password, host, port, database } = data;
console.log(`postgres://${user}:${password}@${host}:${port}/${database}`);
