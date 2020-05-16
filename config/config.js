const fs = require("fs");
const yml = require("js-yaml");

function readConfigFiles() {
  let fileContents;
  try {
    fileContents = fs.readFileSync(
      __dirname + `/secrets/${getEnviromentName()}.yaml`,
      "utf8"
    );
  } catch {
    console.error(`Unable to read config file for env ${getEnviromentName()}`);
  }

  let data = yml.safeLoad(fileContents);
  return data;
}

function getEnviromentName() {
  return process.env.NODE_ENV;
}

module.exports = { readConfigFiles, getEnviromentName };
