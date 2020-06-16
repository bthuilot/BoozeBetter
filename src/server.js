const express = require('express');
const { join } = require('path');
const { readConfigFiles } = require('./config/config');
const { setRoutes } = require('./config/routes');
// Database and DAOs
const Database = require('./db/dao');
const RecipeDAO = require('./db/recipe');
// Managers
const RecipeManager = require('./managers/recipe');
// Controllers
const RecipeController = require('./controllers/recipes');

const config = readConfigFiles();

function setUpDBConnection() {
  /**
   * Setup Database
   */
  return new Database(config.database);
}

function serve(db) {
  const app = express();
  app.use(express.json());

  // Serve the static files from the React app
  app.use(express.static(join(__dirname, '../client/build')));

  /**
   * DAOs *
   */

  // DAO for interacting with recipe table
  const recipeDAO = new RecipeDAO(db);

  /**
   * Managers *
   */

  // Manager for recipes
  const recipeManager = new RecipeManager(recipeDAO);

  /**
   * Controllers *
   */

  // Recipe controller
  const recipeController = new RecipeController(recipeManager);

  setRoutes([recipeController], app);

  // Route all unknown requests to react
  app.get('*', (req, res) => {
    res.sendFile(join(`${__dirname}/../client/build/index.html`));
  });

  return app;
}

module.exports = { serve };

function main() {
  const db = setUpDBConnection();
  const app = serve(db);
  const port = process.env.PORT || 5000;
  app.listen(port);

  /* eslint-disable no-console */ console.log(`App is listening on port ${port}`);
}

if (require.main === module) {
  process.title = 'BoozeBetter';
  main();
}
