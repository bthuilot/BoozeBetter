const { check, validationResult } = require('express-validator');
const { restricted, handleErrors } = require('../helpers');

class RecipesController {
  constructor(manager) {
    this.manager = manager;
  }

  registerRoutes(app) {
    // Retunrs a pagninated list of recipes based on search query
    app.get('/recipes', (req, res) => {
      const { limit, q } = req.query;
      const query = RecipesController.parseQuery(q);
      if (query.length === 0) {
        res.json([]);
      } else {
        this.manager.getRecipes(query, limit).then((result) => res.json(result));
      }
    });

    // Retunrs a pagninated list of recipes based on search query
    app.get('/recipe/:id', (req, res) => {
      const { id } = req.params;
      this.manager
        .getRecipeByID(id)
        .then((result) => {
          res.json({ recipe: result, canEdit: req.userID === result.userID });
        })
        .catch((err) => {
          handleErrors(err, res);
        });
    });

    app.post(
      '/recipe/create',
      [
        // name is at least length 1 and less than length 50
        check('name', 'Name must be between 1 and 255 characters')
          .exists()
          .isString()
          .isLength({ min: 1, max: 255 }),
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
          /* eslint-disable no-useless-escape */ .custom((val) => /^[\.\d\W\\]+$/.test(val)),
        check(
          'instructions.*',
          'instructions must contain strings of at least 1 character long and 255'
        )
          .exists()
          .isString()
          .isLength({ max: 255 }),
        check('description', 'Description must be a string').isString(),
      ],
      restricted,
      (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          res.status(422).json({ errors: errors.array() });
          return;
        }
        this.manager
          .createRecipe(req.body, req.userID)
          .then((id) => {
            res.json({ message: `Succesfully created recipe with id ${id}`, id });
          })
          .catch((err) => {
            handleErrors(err, res);
          });
      }
    );

    app.delete('/recipe/:id/', restricted, (req, res) => {
      const { id } = req.params;
      this.manager
        .deleteRecipe(id, req.userID)
        .then(() => {
          res.json({ successes: [{ msg: 'Successfully deleted recipe' }] });
        })
        .catch((err) => {
          handleErrors(err, res);
        });
    });

    app.post(
      '/recipe/:id/update',
      [
        // name is at least length 1 and less than length 50
        check('name', 'Name must be between 1 and 255 characters')
          .exists()
          .isString()
          .isLength({ min: 1, max: 255 }),
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
          /* eslint-disable no-useless-escape */ .custom((val) => /^[\.\d\W\\]+$/.test(val)),
        check(
          'instructions.*',
          'instructions must contain strings of at least 1 character long and 255'
        )
          .exists()
          .isString()
          .isLength({ max: 255 }),
        check('description', 'Description must be a string').isString(),
      ],
      restricted,
      (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          res.status(422).json({ errors: errors.array() });
          return;
        }
        const { id } = req.params;
        this.manager
          .updateRecipe(id, req.body, req.userID)
          .then(() => {
            res.json({ successes: { msg: `Successfully updated recipe` } });
          })
          .catch((err) => {
            handleErrors(err, res);
          });
      }
    );
  }

  static parseQuery(query) {
    if (!query) {
      return [];
    }
    const splitQuery = query.split(',');
    return splitQuery.map((element) => decodeURIComponent(element)).filter((i) => i !== '');
  }
}

module.exports = RecipesController;
