const { Database } = require("../../db/dao");
const { itif } = require("../test_helpers");
const { readConfigFiles } = require("../../config/config");

describe("running querys on database", () => {
  const run_tests = process.env.TEST_DB == 1;
  let db;
  beforeAll(() => {
    config_file = readConfigFiles();
    db = new Database(config_file["db"]);
  });

  itif(run_tests)("run table query", () => {
    expect.assertions(1);
    return db
      .runQuery(
        `SELECT table_name
    FROM information_schema.tables
    WHERE table_type='BASE TABLE'
    AND table_schema='public';`
      )
      .then((res) => {
        expect(res.rows.length).not.toBe(0);
      });
  });
});
