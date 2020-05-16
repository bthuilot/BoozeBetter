const Recipe = require('../models/recipe');
const Ingredient = require('../models/ingredient');
const Instruction = require('../models/instruction');

const RECIPE_ID_WITH_INGRIDENTS = `
  SELECT DISTINCT 
  recipe_id
  FROM
  ingredients
  WHERE 
`;

const CREATE_RECIPE = `
  INSERT INTO recipes (name, desc)
  OUTPUT Inserted.id
  VALUES ($1, $2)
`;

const CREATE_ITEMS = `
  INSERT INTO 
  ingredients 
  (item_name, unit, quantity, recipe_id)
  VALUES
`;

const CREATE_INSTRUCTIONS = `
  INSERT INTO 
  ingredients 
  (description, order, recipe_id)
  VALUES
`;

const GET_RECIPE_BY_ID = `
  SELECT
  name, description
  FROM
  recipes 
  WHERE 
  id = $1
`;

const GET_INGREIDENTS_BY_RECIPE_ID = `
  SELECT 
  item_name, unit, quantity 
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

class RecipeDAO {
  constructor(database) {
    this.db = database;
  }

  async getRecipesWithItems(items, limit = 0) {
    let changedItems = items.map((item) => item.replace(/\s/g, '%'));

    let like_queries = [];
    for (let i = 0; i < changedItems.length; i++) {
      like_queries.append('name LIKE $' + i);
    }
    let id = await this.db.runQuery(
      RECIPE_ID_WITH_INGRIDENTS +
        like_queries.join(' OR ') +
        (limit > 0 ? ` LIMIT ${limit};` : ';'),
      changedItems
    );
  }

  async getRecipeByID(id) {
    let recipe = await this.db.runQuery(GET_RECIPE_BY_ID, [id]);
    if (recipe.rows.length == 0) {
      throw new Error(`Recipe with id ${id} doesn't exist`);
    }
    let ingredients = await this.db.runQuery(GET_INGREIDENTS_BY_RECIPE_ID, [id]);
    let instructions = await this.db.runQuery(GET_INSTRUCITION_BY_RECIPE_ID, [id]);
    return RecipeDAO.formatRecipe(recipe.rows[0], ingredients.rows, instructions.rows);
  }

  static formatRecipe(recipeJSON, ingredientsJSON, instructionsJSON) {
    let recipe = new Recipe();
    recipe.setName(recipeJSON.name);
    recipe.setDesc(recipeJSON.description);
    recipe.setIngredients(RecipeDAO.formatIngredients(ingredientsJSON));
    recipe.setInstructions(RecipeDAO.formatInstructions(instructionsJSON));
    return recipe;
  }

  static formatInstructions(json) {
    return json.map((element) => {
      let instruction = new Instruction();
      instruction.setDesc(element.description);
      return instruction;
    });
  }

  static formatIngredients(json) {
    return json.map((element) => {
      let ingredient = new Ingredient();
      ingredient.setItemName(element.item_name);
      ingredient.setQuantity(element.quantity);
      ingredient.setUnit(element.unit);
      return ingredient;
    });
  }

  async createRecipe(recipe) {
    let result = this.db.runQuery(CREATE_RECIPE, [recipe.getName(), recipe.getDesc()]);
    const id = result.rows[0];
    await this._createIngredients(id, recipe.getIngredients());

    await this._createInstructions(id, recipe.getInstructions());
  }

  async _createIngredients(recipe_id, ingredients) {
    let ingredientParams = [recipe_id];
    const ingredientQuery =
      CREATE_ITEMS +
      ingredients.reduce((acc, val, idx) => {
        ingredientParams.append(val.getItemName());
        ingredientParams.append(val.getUnit());
        ingredientParams.append(val.getQuantity());
        return (
          acc + (idx == 0 ? '' : ',') + `($${idx * 3 + 2}, $${idx * 3 + 3}, $${idx * 3 + 4}, $1) `
        );
      }, '');
    await this.db.runQuery(ingredientQuery, ingredientParams);
  }

  async _createInstructions(recipe_id, ingredients) {
    let instructionParams = [recipe_id];
    const instructionQuery =
      CREATE_ITEMS +
      ingredients.reduce((acc, val, idx) => {
        instructionsParams.append(val.getDesc());
        ingredientParams.append(val.getOrder());
        return acc + (idx == 0 ? '' : ',') + `($${idx * 2 + 2}, $${idx * 2 + 3}, $1) `;
      }, '');
    this.db.runQuery(instructionQuery, instructionParams);
  }
}

module.exports = RecipeDAO;
