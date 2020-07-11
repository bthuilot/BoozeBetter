const NotFoundError = require('../types/errors/notFound');

const RECIPE_ID_WITH_INGRIDENTS = `
  SELECT DISTINCT 
  recipe_id
  FROM
  ingredients
  WHERE 
`;

const CREATE_RECIPE = `
  INSERT INTO recipes (name, description, user_id)
  VALUES ($1, $2, $3) RETURNING id
`;

const UPDATE_RECIPE = `
  UPDATE recipes 
  SET name = $1, description = $2 
  WHERE id = $3
`;

const CREATE_ITEMS = `
  INSERT INTO 
  ingredients 
  (item_name, unit, quantity, recipe_id)
  VALUES
`;

const CREATE_INSTRUCTIONS = `
  INSERT INTO 
  instructions
  (description, ordering, recipe_id)
  VALUES
`;

const GET_RECIPE_BY_ID = `
  SELECT
  name, description, user_id
  FROM
  recipes 
  WHERE 
  id = $1
`;

const GET_INGREIDENTS_BY_RECIPE_ID = `
  SELECT 
  item_name,
  unit, quantity 
  FROM 
  ingredients
  WHERE
  recipe_id = $1
`;

const GET_INSTRUCITION_BY_RECIPE_ID = `
  SELECT 
  ordering, description 
  FROM
  instructions
  WHERE
  recipe_id = $1
  ORDER BY 
  ordering 
  ASC
`;

const GET_RECIPE_BY_USER_ID = `
  SELECT
  id, name, description
  FROM
  recipes
  WHERE
  user_id = $1
`;

const DELETE_RECIPE_QUERY = `
  DELETE FROM
  recipes
  WHERE 
  id IN 
`;

const DELETE_INSTRUCTIONS = `
  DELETE FROM
  instructions
  WHERE 
  recipe_id = $1
 `;

const DELETE_INGREDIENTS = `
  DELETE FROM
  ingredients
  WHERE 
  recipe_id = $1
 `;

class RecipeDAO {
  constructor(database) {
    this.db = database;
  }

  async getRecipesWithItems(items, limit = 0) {
    const changedItems = items.map((item) => `.*${item.replace(/\s/g, '.*')}.*`);

    const likeQueries = [];
    for (let i = 1; i < changedItems.length + 1; i += 1) {
      likeQueries.push(`item_name ~* $${i}`);
    }
    const recipeIds = await this.db.runQuery(
      RECIPE_ID_WITH_INGRIDENTS + likeQueries.join(' OR ') + (limit > 0 ? ` LIMIT ${limit};` : ';'),
      changedItems
    );

    return this.getRecipesWithIDs(recipeIds.rows.map((row) => row.recipe_id));
  }

  async getRecipesWithIDs(ids) {
    return Promise.all(ids.map((id) => this.getRecipeByID(id)));
  }

  async canUserEditReicpe(id, userID) {
    const recipe = await this.db.runQuery(GET_RECIPE_BY_ID, [id]);
    return recipe.rows.length === 1 && recipe.rows[0].user_id === userID;
  }

  async updateRecipe(id, recipe) {
    const result = await this.db.runQuery(UPDATE_RECIPE, [recipe.name, recipe.description, id]);
    if (result.rowCount !== 1) {
      throw new Error('Unable to update recipe');
    }
    await this.updateIngredients(id, recipe.ingredients);
    await this.updateInstructions(id, recipe.instructions);
    return id;
  }

  async updateIngredients(recipeId, ingredients) {
    await this.deleteIngredients(recipeId);
    return this.createIngredients(recipeId, ingredients);
  }

  async deleteInstructions(recipeId) {
    return this.db.runQuery(DELETE_INSTRUCTIONS, [recipeId]);
  }

  async deleteIngredients(recipeId) {
    return this.db.runQuery(DELETE_INGREDIENTS, [recipeId]);
  }

  async updateInstructions(recipeId, instructions) {
    await this.deleteInstructions(recipeId);
    return this.createInstructions(recipeId, instructions);
  }

  async getRecipeByID(id) {
    const recipe = await this.db.runQuery(GET_RECIPE_BY_ID, [id]);
    if (recipe.rows.length === 0) {
      throw new NotFoundError(`Unable to find recipe with ID ${id}`);
    }
    const ingredients = await this.db.runQuery(GET_INGREIDENTS_BY_RECIPE_ID, [id]);
    const instructions = await this.db.runQuery(GET_INSTRUCITION_BY_RECIPE_ID, [id]);
    // eslint-disable-next-line camelcase
    const { name, description, user_id } = recipe.rows[0];
    return {
      id,
      name,
      description,
      ingredients: ingredients.rows.map((i) => {
        const formatted = { ...i };
        formatted.itemName = formatted.item_name;
        delete formatted.item_name;
        return formatted;
      }),
      instructions: instructions.rows.map((i) => i.description),
      userID: user_id,
    };
  }

  async createRecipe(recipe, userId) {
    const result = await this.db.runQuery(CREATE_RECIPE, [recipe.name, recipe.description, userId]);
    if (result.rows.length !== 1) {
      throw new Error('Unable to create recipe');
    }
    const { id } = result.rows[0];
    await this.createIngredients(id, recipe.ingredients);

    await this.createInstructions(id, recipe.instructions);
    return id;
  }

  async getRecipesByUserID(userID) {
    const result = await this.db.runQuery(GET_RECIPE_BY_USER_ID, [userID]);
    return result.rows;
  }

  async createIngredients(recipeId, ingredients) {
    const ingredientParams = [recipeId];
    const ingredientQuery =
      CREATE_ITEMS +
      ingredients.reduce((acc, val, idx) => {
        ingredientParams.push(val.itemName, val.unit, val.quantity);
        return `${acc + (idx === 0 ? '' : ',')}($${idx * 3 + 2}, $${idx * 3 + 3}, $${
          idx * 3 + 4
        }, $1) `;
      }, '');
    await this.db.runQuery(ingredientQuery, ingredientParams);
  }

  async createInstructions(recipeId, instructions) {
    const instructionParams = [recipeId];
    const instructionQuery =
      CREATE_INSTRUCTIONS +
      instructions.reduce((acc, val, idx) => {
        instructionParams.push(val, idx + 1);
        return `${acc + (idx === 0 ? '' : ',')}($${idx * 2 + 2}, $${idx * 2 + 3}, $1) `;
      }, '');
    await this.db.runQuery(instructionQuery, instructionParams);
  }

  async removeRecipesWithIDs(...ids) {
    const params = ids.map((id, index) => `$${index + 1}`);
    const query = `${DELETE_RECIPE_QUERY} (${params.join(', ')})`;
    const result = await this.db.runQuery(query, ids);
    return result.rowCount === ids.length;
  }
}

module.exports = RecipeDAO;
