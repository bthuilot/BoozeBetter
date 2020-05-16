const { Database } = require('../../db/dao');
const { itif } = require('../test_helpers');
const { readConfigFiles } = require('../../config/config');
const RecipeDAO = require('../../db/recipe');
const Recipe = require('../../models/recipe');

const RUN_TESTS = process.env.TEST_DB === '1';
const TEST_ID_1 = 11111111;
const TEST_ID_2 = 11111112;

async function setUpTestData(db) {
  // TODO rename column
  if (RUN_TESTS) {
    await db.runQuery(
      `INSERT INTO recipes (id, name, description) VALUES ($1, 'TEST_RECIPE', 'THIS_IS_A_TEST')`,
      [TEST_ID_1]
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
      `INSERT INTO instructions (description, ordering, recipe_id) VALUES ('INSTRUCTION_1', 1, $1)`,
      [TEST_ID_1]
    );
    await db.runQuery(
      `INSERT INTO instructions (description, ordering, recipe_id) VALUES ('INSTRUCTION_2', 2, $1)`,
      [TEST_ID_1]
    );
  }
}

async function tearDownData(db) {
  if (RUN_TESTS) {
    await db.runQuery(`DELETE FROM recipes WHERE id = ${TEST_ID_1}`);
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
  expect(recipe.getName()).toBe(name);
  expect(recipe.getDesc()).toBe(description);
}

function validateIngredient(ingr, name, quantity, unit) {
  expect(ingr.getItemName()).toBe(name);
  expect(ingr.getQuantity()).toBe(quantity);
  expect(ingr.getUnit()).toBe(unit);
}

function validateTestRecipe(recipe) {
  expect(recipe instanceof Recipe).toBeTruthy();
  validateRecipe(recipe, 'TEST_RECIPE', 'THIS_IS_A_TEST');

  const ingredients = recipe.getIngredients();
  expect(ingredients.length).toBe(2);
  validateIngredient(ingredients[0], 'TEST_ITEM_1', '3/4', 'cup');
  validateIngredient(ingredients[1], 'TEST_ITEM_2', '75', '%');

  const instructions = recipe.getInstructions();
  expect(instructions.length).toBe(2);
  expect(instructions[0].getDesc()).toBe('INSTRUCTION_1');
  expect(instructions[1].getDesc()).toBe('INSTRUCTION_2');
}

describe('getting recipe data', () => {
  itif(RUN_TESTS)('get recipe by id', async () => {
    const res = await recipeDAO.getRecipeByID(TEST_ID_1);
    validateTestRecipe(res);
  });

  itif(RUN_TESTS)('get recipe that doesnt exist', async () => {
    await expect(recipeDAO.getRecipeByID(TEST_ID_2)).rejects.toThrow(
      `Recipe with id ${TEST_ID_2} doesn't exist`
    );
  });

  itif(RUN_TESTS)('get recipe by ingredient likeness', async () => {});
});
