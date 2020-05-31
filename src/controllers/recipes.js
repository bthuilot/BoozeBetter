const { check, validationResult } = require('express-validator');

class RecipesController {
  constructor(manager) {
    this.manager = manager;
  }

  registerRoutes(app) {
    // Retunrs a pagninated list of recipes based on search query
    app.get('/recipes', (req, res) => {
      const { limit, q } = req.query;
      const query = RecipesController.parseQuery(q);
      this.manager.getRecipes(query, limit).then((result) => res.json(result));
    });

    // Retunrs a pagninated list of recipes based on search query
    app.get('/recipes/:id', (req, res) => {
      const { id } = req.params;
      res.json(this.manager.getRecipeById(id));
    });

    app.post(
      '/recipes/create',
      [
        // name is at least length 5 and less than length 50
        check('name').exists().isString().isLength({ min: 5, max: 255 }),
        check('ingredients', 'Ingredients must be an array').exists().isArray(),
        check('instructions', 'Instructions must be an array').exists().isArray(),
        check(
          'ingredients.*.itemName',
          'Item names for ingredients must between 5 and 10 characters long'
        )
          .exists()
          .isString()
          .isLength({ min: 5, max: 255 }),
        check('ingredients.*.unit', 'Units for ingredients must between 5 and 10 characters long')
          .exists()
          .isString()
          .isLength({ min: 5, max: 255 }),
        check('ingredients.*.quantity', 'quantity for ingredients must between a numeric value')
          .exists()
          .isString()
          .custom((val) => RegExp('(?:d+|d+.d+|d+\\d+)').test(val)),
        check('instructions.*.description').exists().isString().isLength({ min: 5, max: 255 }),
        check('description').isString(),
      ],
      (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          res.status(422).json({ errors: errors.array() });
        }
        res.json(this.manager.createRecipe(req.body));
      }
    );
  }

  static parseQuery(query) {
    const splitQuery = query.split('+');
    return splitQuery.map((element) => decodeURIComponent(element));
  }
}

module.exports = RecipesController;
