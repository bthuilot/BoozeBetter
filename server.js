import express, { static } from "express";
import { join } from "path";
import Database from "./db/dao";
import RecipeDAO from "./db/recipe";
import RecipeManager from "./managers/recipe";
import RecipeController from "./controllers/recipes";
import { readConfigFiles } from "./config/config";
import { setRoutes } from "./config/routes";

function serve() {
  const app = express();

  // Serve the static files from the React app
  app.use(static(join(__dirname, "frontend/build")));

  config = readConfigFiles();

  /**
   * Setup Database
   */
  const db = new Database(config.database);

  /********
   * DAOs *
   ********/

  // DAO for interacting with recipe table
  const recipeDAO = new RecipeDAO(db);

  /************
   * Managers *
   ************/

  // Manager for recipes
  const recipeManager = new RecipeManager(recipeDAO);

  /***************
   * Controllers *
   ***************/

  // Recipe controller
  const recipeController = new RecipeController(recipeManager);

  setRoutes([recipeController], app);

  const port = process.env.PORT || 5000;
  app.listen(port);

  console.log("App is listening on port " + port);
}

serve();
