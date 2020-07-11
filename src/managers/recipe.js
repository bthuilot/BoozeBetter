const ForbiddenError = require('../types/errors/forbidden');

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

  async deleteRecipe(id, userID) {
    const canEdit = await this.dao.canUserEditReicpe(id, userID);
    if (!canEdit) {
      throw new ForbiddenError(`You are not the creator or authorized to edit this recipe`);
    }
    return this.dao.removeRecipesWithIDs(id);
  }

  async updateRecipe(id, recipe, userID) {
    const canEdit = await this.dao.canUserEditReicpe(id, userID);
    if (!canEdit) {
      throw new ForbiddenError(`You are not the creator or authorized to edit this recipe`);
    }
    return this.dao.updateRecipe(id, recipe);
  }
}

module.exports = RecipeManager;
