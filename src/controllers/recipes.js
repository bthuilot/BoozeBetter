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
          .isLength({ max: 255 }),
        check('ingredients.*.unit', 'Units for ingredients must between 5 and 10 characters long')
          .exists()
          .isString()
          .isLength({ max: 255 }),
        check(
          'ingredients.*.quantity',
          'quantity for ingredients must a numeric value (i.e. 1/2, 1, 0.5)'
        )
          .exists()
          .isString()
          .custom((val) => /^[\d\W\\\.]+$/.test(val)),
        check('instructions.*').exists().isString().isLength({ max: 255 }),
        check('description').isString(),
      ],
      (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          res.status(422).json({ errors: errors.array() });
          return;
        }
        this.manager.createRecipe(req.body).then((id) => {
          if (id == -1) {
            res.json({ errors: [{ message: 'Unable to create recipe' }] });
            return;
          }
          res.json({ message: `Succesfully created recipe with id ${id}`, id: id });
        });
      }
    );
  }

  static parseQuery(query) {
    const splitQuery = query.split('+');
    return splitQuery.map((element) => decodeURIComponent(element));
  }
}

module.exports = RecipesController;
