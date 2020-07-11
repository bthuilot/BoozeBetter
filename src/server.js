const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const { join } = require('path');
const { readConfigFiles } = require('./config/config');
const { setRoutes } = require('./config/routes');
// Database and DAOs
const Database = require('./db/dao');
const RecipeDAO = require('./db/recipe');
const UserDAO = require('./db/user');
// Managers
const RecipeManager = require('./managers/recipe');
const UserManager = require('./managers/user');
const AuthManager = require('./managers/auth');
// Controllers
const RecipeController = require('./controllers/recipes');
const UserController = require('./controllers/users');

const config = readConfigFiles();

function setUpDBConnection() {
  /**
   * Setup Database
   */
  return new Database(config.database);
}

function serve(db) {
  const app = express();

  // Middleware pakcages
  app.use(express.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cookieParser());

  // Serve the static files from the React app
  app.use(express.static(join(__dirname, '../client/build')));

  /**
   * DAOs *
   */

  // DAO for interacting with recipe table
  const recipeDAO = new RecipeDAO(db);
  // DAO for interacting with users table
  const userDAO = new UserDAO(db);

  /**
   * Managers *
   */

  // Manager for recipes
  const recipeManager = new RecipeManager(recipeDAO);
  // Manager for users
  const userManager = new UserManager(userDAO, recipeDAO);
  // Manager for auth tokens and cookies
  const authManager = new AuthManager();

  // Tells app to use Auth manager
  app.use(authManager.setUser);

  /**
   * Controllers *
   */

  // Recipe controller
  const recipeController = new RecipeController(recipeManager);
  // Users controller
  const userController = new UserController(userManager, authManager);

  // Sets routes for controllers
  setRoutes([recipeController, userController], app);

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
