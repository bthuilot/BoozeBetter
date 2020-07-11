class RecipeManager {
    static getRecipeByIDMock = jest.fn();
    static getRecipesMock = jest.fn();
    static createRecipesMock = jest.fn();
    static deleteRecipeMock = jest.fn();
    static updateRecipeMock = jest.fn();

    getRecipes(ingredents, limit) {
        return new Promise( r => r(RecipeManager.getRecipesMock(ingredents, limit)));
    }

    createRecipe(recipe, userID) {
        return new Promise(r => r(RecipeManager.createRecipesMock(recipe, userID)));
    }

    getRecipeByID(id) {
        return new Promise(r => r(RecipeManager.getRecipeByIDMock(id)));
    }

    async deleteRecipe(id, userID) {
        return new Promise(r => r(RecipeManager.deleteRecipeMock(id, userID)));
    }

    async updateRecipe(id, recipe, userID) {
        return new Promise(r => r(RecipeManager.updateRecipeMock(id, recipe, userID)));
    }
}

module.exports = RecipeManager;
