const { readConfigFiles } = require('../config/config');

const data = readConfigFiles().database;
const { user, password, host, port, database } = data;
/* eslint-disable no-console */ console.log(
  `postgres://${user}:${password}@${host}:${port}/${database}`
);
