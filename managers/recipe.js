class RecipeManager {
  constructor(dao) {
    this.dao = dao;
  }

  getRecipes(ingredents, limit) {
    return this.dao.getRecipesWithItems(ingredents, limit);
  }

  createRecipe(recipe) {
    return this.dao.createRecipe(recipe);
  }
}

module.exports = RecipeManager;
