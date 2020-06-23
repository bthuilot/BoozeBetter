const Database = require('../../db/dao');
const { itif } = require('../test_helpers');
const { readConfigFiles } = require('../../config/config');
const RecipeDAO = require('../../db/recipe');

const RUN_TESTS = process.env.TEST_DB === '1';
const TEST_ID_1 = 11111111;
const TEST_ID_2 = 11111112;
const TEST_ID_3 = 11111113;

async function setUpTestData(db) {
  // TODO rename column
  if (RUN_TESTS) {
    await db.runQuery(
      `INSERT INTO recipes (id, name, description) VALUES ($1, 'TEST_RECIPE', 'THIS_IS_A_TEST')`,
      [TEST_ID_1]
    );
    await db.runQuery(
      `INSERT INTO recipes (id, name, description) VALUES ($1, 'TEST_RECIPE_3', 'THIS_IS_A_TEST_3')`,
      [TEST_ID_3]
    );
    await db.runQuery(
      `INSERT INTO ingredients (item_name, quantity, unit, recipe_id) VALUES ('TEST_ITEM_1', '3/4', 'cup', $1)`,
      [TEST_ID_1]
    );
    await db.runQuery(
      `INSERT INTO ingredients (item_name, quantity, unit, recipe_id) VALUES ('TEST_ITEM_2', '75', '%', $1)`,
      [TEST_ID_1]
    );
    await db.runQuery(
      `INSERT INTO ingredients (item_name, quantity, unit, recipe_id) VALUES ('TEST_ITEM_3', '1/5', 'gram', $1)`,
      [TEST_ID_3]
    );
    await db.runQuery(
      `INSERT INTO instructions (description, ordering, recipe_id) VALUES ('INSTRUCTION_1', 1, $1)`,
      [TEST_ID_1]
    );
    await db.runQuery(
      `INSERT INTO instructions (description, ordering, recipe_id) VALUES ('INSTRUCTION_2', 2, $1)`,
      [TEST_ID_1]
    );
    await db.runQuery(
      `INSERT INTO instructions (description, ordering, recipe_id) VALUES ('INSTRUCTION_3', 1, $1)`,
      [TEST_ID_3]
    );
  }
}

async function tearDownData(db) {
  if (RUN_TESTS) {
    await db.runQuery(`DELETE FROM recipes WHERE id in ($1, $2)`, [TEST_ID_1, TEST_ID_3]);
  }
}

let recipeDAO;
let db;

beforeAll(async () => {
  const configFile = readConfigFiles();
  db = new Database(configFile.db);
  await setUpTestData(db);
  recipeDAO = new RecipeDAO(db);
});

afterAll(async () => {
  await tearDownData(db);
});

function validateRecipe(recipe, name, description) {
  expect(recipe.name).toBe(name);
  expect(recipe.description).toBe(description);
}

function validateIngredient(ingr, name, quantity, unit) {
  expect(ingr.itemName).toBe(name);
  expect(ingr.quantity).toBe(quantity);
  expect(ingr.unit).toBe(unit);
}

function validateTestRecipe1(recipe) {
  validateRecipe(recipe, 'TEST_RECIPE', 'THIS_IS_A_TEST');

  const ingredients = recipe.ingredients;
  expect(ingredients.length).toBe(2);
  validateIngredient(ingredients[0], 'TEST_ITEM_1', '3/4', 'cup');
  validateIngredient(ingredients[1], 'TEST_ITEM_2', '75', '%');

  const instructions = recipe.instructions;
  expect(instructions.length).toBe(2);
  expect(instructions[0]).toBe('INSTRUCTION_1');
  expect(instructions[1]).toBe('INSTRUCTION_2');
}

function validateTestRecipe3(recipe) {
  validateRecipe(recipe, 'TEST_RECIPE_3', 'THIS_IS_A_TEST_3');

  const ingredients = recipe.ingredients;
  expect(ingredients.length).toBe(1);
  validateIngredient(ingredients[0], 'TEST_ITEM_3', '1/5', 'gram');

  const instructions = recipe.instructions;
  expect(instructions.length).toBe(1);
  expect(instructions[0]).toBe('INSTRUCTION_3');
}

describe('getting recipe data', () => {
  itif(RUN_TESTS)('get recipe by id', async () => {
    const res = await recipeDAO.getRecipeByID(TEST_ID_1);
    validateTestRecipe1(res);
  });

  itif(RUN_TESTS)('get recipe that doesnt exist', async () => {
    await expect(recipeDAO.getRecipeByID(TEST_ID_2)).rejects.toThrow(
      `Recipe with id ${TEST_ID_2} doesn't exist`
    );
  });

  itif(RUN_TESTS)('get recipes by id', async () => {
    const res = await recipeDAO.getRecipesWithIDs([TEST_ID_1, TEST_ID_3]);
    expect(res.length).toBe(2);
    validateTestRecipe1(res[0]);
    validateTestRecipe3(res[1]);
  });

  itif(RUN_TESTS)('get recipe by ingredient likeness', async () => {
    const res = await recipeDAO.getRecipesWithItems(['TEST ITEM']);
    expect(res.length).toBe(2);
    validateTestRecipe1(res[0]);
    validateTestRecipe3(res[1]);
  });
});

function createNewTestRecipe() {
  const recipe = {};
  recipe.name = 'TEST_RECIPE_4';
  recipe.description = 'TEST_RECIPE_4_DESC';
  // Create Ingredient
  const ingredient = {};
  ingredient.itemName = 'TEST_INGREDIENT_4';
  ingredient.quantity = '4';
  ingredient.unit = 'oz';

  recipe.ingredients = [ingredient];
  // Create Instructions

  recipe.instructions = ['1', '2'];
  return recipe;
}

describe('creating recipes', () => {
  itif(RUN_TESTS)('create new recipe', async () => {
    const created = createNewTestRecipe();
    const id = await recipeDAO.createRecipe(created);
    expect(id).not.toBe(-1);
    created.id = id;
    const returned = await recipeDAO.getRecipeByID(id);
    // Cleanup now incase test fails
    recipeDAO.removeRecipesWithIDs(id);
    expect(returned).toStrictEqual(created);
  });
});

describe('removing reicpes', () => {
  itif(RUN_TESTS)('delete 1 recipe', async () => {
    const created = createNewTestRecipe();
    const id = await recipeDAO.createRecipe(created);
    expect(id).not.toBe(-1);
    await recipeDAO.removeRecipesWithIDs(id);
    expect(recipeDAO.getRecipeByID(id)).rejects.toThrow(`Recipe with id ${id} doesn't exist`);
  });

  itif(RUN_TESTS)('delete multiple recipes', async () => {
    const created = createNewTestRecipe();
    const id1 = await recipeDAO.createRecipe(created);
    const id2 = await recipeDAO.createRecipe(created);
    expect(id1).not.toBe(-1);
    expect(id2).not.toBe(-1);
    await recipeDAO.removeRecipesWithIDs(id1, id2);
    await expect(recipeDAO.getRecipeByID(id1)).rejects.toThrow(
      `Recipe with id ${id1} doesn't exist`
    );
    await expect(recipeDAO.getRecipeByID(id2)).rejects.toThrow(
      `Recipe with id ${id2} doesn't exist`
    );
  });
});
