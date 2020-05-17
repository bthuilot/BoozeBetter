class RecipesController {
  constructor(manager) {
    this.manager = manager;
  }

  registerRoutes(app) {
    // Retunrs a pagninated list of recipes based on search query
    app.get('/recipes', (req, res) => {
      const { limit, q } = req.query;
      const query = RecipesController.parseQuery(q);
      res.json(this.manager.getRecipes(query, limit));
    });
  }

  static parseQuery(query) {
    const splitQuery = query.split('+');
    return splitQuery.map((element) => decodeURIComponent(element));
  }
}

module.exports = RecipesController;
