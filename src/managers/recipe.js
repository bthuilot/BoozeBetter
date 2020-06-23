const RecipeDAO = require('../db/recipe');

class RecipeManager {
  constructor(dao) {
    this.dao = dao;
  }

  getRecipes(ingredents, limit) {
    return this.dao.getRecipesWithItems(ingredents, limit);
  }

  createRecipe(recipe, userID) {
    return this.dao.createRecipe(recipe, userID);
  }

  getRecipeByID(id) {
    return this.dao.getRecipeByID(id);
  }
}

module.exports = RecipeManager;
