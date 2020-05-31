const fs = require('fs');
const yml = require('js-yaml');
const path = require('path');

function getEnviromentName() {
  return process.env.NODE_ENV || 'development';
}

function readConfigFiles() {
  const fileContents = fs.readFileSync(
    path.join(__dirname, `/secrets/${getEnviromentName()}.yml`),
    'utf8'
  );

  return yml.safeLoad(fileContents);
}

module.exports = { readConfigFiles, getEnviromentName };
