const RecipeDAO = require('../db/recipe');

class RecipeManager {
  constructor(dao) {
    this.dao = dao;
  }

  getRecipes(ingredents, limit) {
    return this.dao.getRecipesWithItems(ingredents, limit);
  }

  createRecipe(recipe) {
    return this.dao.createRecipe(RecipeDAO.recipeFromJSON(recipe));
  }
}

module.exports = RecipeManager;
