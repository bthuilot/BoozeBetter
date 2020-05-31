const Database = require('../../db/dao');
const { itif } = require('../test_helpers');
const { readConfigFiles } = require('../../config/config');
const RecipeDAO = require('../../db/recipe');
const Recipe = require('../../models/recipe');
const Ingredient = require('../../models/ingredient');
const Instruction = require('../../models/instruction');

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
  expect(recipe.getName()).toBe(name);
  expect(recipe.getDesc()).toBe(description);
}

function validateIngredient(ingr, name, quantity, unit) {
  expect(ingr.getItemName()).toBe(name);
  expect(ingr.getQuantity()).toBe(quantity);
  expect(ingr.getUnit()).toBe(unit);
}

function validateTestRecipe1(recipe) {
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

function validateTestRecipe3(recipe) {
  expect(recipe instanceof Recipe).toBeTruthy();
  validateRecipe(recipe, 'TEST_RECIPE_3', 'THIS_IS_A_TEST_3');

  const ingredients = recipe.getIngredients();
  expect(ingredients.length).toBe(1);
  validateIngredient(ingredients[0], 'TEST_ITEM_3', '1/5', 'gram');

  const instructions = recipe.getInstructions();
  expect(instructions.length).toBe(1);
  expect(instructions[0].getDesc()).toBe('INSTRUCTION_3');
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
  const recipe = new Recipe();
  recipe.setName('TEST_RECIPE_4');
  recipe.setDesc('TEST_RECIPE_4_DESC');
  // Create Ingredient
  const ingredient = new Ingredient();
  ingredient.setItemName('TEST_INGREDIENT_4');
  ingredient.setQuantity('4');
  ingredient.setUnit('Oz');

  recipe.setIngredients([ingredient]);
  // Create Instructions
  const instruction1 = new Instruction();
  const instruction2 = new Instruction();
  instruction1.setDesc('1');
  instruction2.setDesc('2');

  recipe.setInstructions([instruction1, instruction2]);
  return recipe;
}

describe('creating recipes', () => {
  itif(RUN_TESTS)('create new recipe', async () => {
    const created = createNewTestRecipe();
    const id = await recipeDAO.createRecipe(created);
    expect(id).not.toBe(-1);
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
