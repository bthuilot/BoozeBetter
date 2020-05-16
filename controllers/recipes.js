const BaseController = require("./base");

class RecipesController extends BaseController {
  constructor(manager) {
    this.manager = manager;
  }

  registerRoutes(app) {
    // Retunrs a pagninated list of recipes based on search query
    app.get("/recipes", (req, res) => {
      query = this.parseQuery(req.query.q);
      limit = req.query.limit;
      res.json(this.manager.getRecipes(query, limit));
    });
  }

  parseQuery(query) {
    splitQuery = query.split("+");
    return splitQuery.map((element) => decodeURIComponent(element));
  }
}

module.exports = RecipesController;
