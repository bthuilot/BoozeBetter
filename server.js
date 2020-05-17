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

function serve() {
  const app = express();

  // Serve the static files from the React app
  app.use(express.static(join(__dirname, 'frontend/build')));

  const config = readConfigFiles();

  /**
   * Setup Database
   */
  const db = new Database(config.database);

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

  const port = process.env.PORT || 5000;
  app.listen(port);

  console.log(`App is listening on port ${port}`);
}

serve();
