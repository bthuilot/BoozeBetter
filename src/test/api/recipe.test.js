const request = require('supertest');
const { serve } = require('../../server');

jest.mock('../../managers/auth');
jest.mock('../../managers/recipe');
const RecipeManager = require('../../managers/recipe');

let app;

beforeAll(() => {
  app = serve();
});

const MOCK_RECIPE = {
  name: 'Test',
  description: 'Test Recipe',
  instructions: ['Test Instruction'],
  ingredients: [{ itemName: 'Test Item', unit: 'oz', quantity: '1/3' }],
};

beforeEach(() => {
  RecipeManager.getRecipesMock.mockClear();
  RecipeManager.getRecipeByIDMock.mockClear();
  RecipeManager.updateRecipeMock.mockClear();
  RecipeManager.deleteRecipeMock.mockClear();
  RecipeManager.createRecipesMock.mockClear();
});

describe('creating recipes', () => {
  it('create new recipe', (done) => {
    RecipeManager.createRecipesMock.mockReturnValue(21);
    request(app)
      .post('/recipe/create')
      .send(MOCK_RECIPE)
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body.id).toBe(21);
        expect(response.body.message).toBe('Succesfully created recipe with id 21');
        const { calls } = RecipeManager.createRecipesMock.mock;
        expect(calls.length).toBe(1);
        expect(calls[0][0]).toStrictEqual(MOCK_RECIPE);
        done();
      });
  });
  it('create fails with no name', (done) => {
    request(app)
      .post('/recipe/create')
      .send({ description: 'Test Recipe', instructions: [], ingredients: [] })
      .expect(400, done);
  });
  it('create fails with no instructions', (done) => {
    request(app)
      .post('/recipe/create')
      .send({ name: 'test', description: 'Test Recipe', ingredients: [] })
      .expect(400, done);
  });
  it('create fails with no name too long', (done) => {
    request(app)
      .post('/recipe/create')
      .send({
        name: `THIS STRING IS > 255 CHARACTERS xxxxxxxxxxxxxxxxxxxx
          xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
          xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
          xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
          xxxxxxxxxxxxxxxxx`,
        description: 'Test Recipe',
        ingredients: [],
        instructions: [],
      })
      .expect(400, done);
  });
  it('create fails with quantity not a number', (done) => {
    request(app)
      .post('/recipe/create')
      .send({
        name: `Name`,
        description: 'Test Recipe',
        ingredients: [{ itemName: 'Test Item', unit: 'oz', quantity: 'no number' }],
        instructions: [],
      })
      .expect(400, done);
  });
});

describe('searching recipes', () => {
  it('parses the query and searches db', (done) => {
    RecipeManager.getRecipesMock.mockReturnValue([{ name: 'Recipe one' }, { name: 'Recipe two' }]);
    request(app)
      .get('/recipes')
      .query({ q: 'Hello+World,Test+String', limit: 100 })
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body).toStrictEqual([{ name: 'Recipe one' }, { name: 'Recipe two' }]);
        expect(RecipeManager.getRecipesMock.mock.calls[0][0]).toStrictEqual([
          'Hello+World',
          'Test+String',
        ]);
        expect(RecipeManager.getRecipesMock.mock.calls[0][1]).toBe('100');
        done();
      });
  });
  it('with empty query returns none', (done) => {
    request(app)
      .get('/recipes')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body).toStrictEqual([]);
        done();
      });
  });
});

describe('getting recipies by id', () => {
  it('gets recipe by id', (done) => {
    const mockWithNonUserId = { ...MOCK_RECIPE, userID: 12 };
    RecipeManager.getRecipeByIDMock.mockReturnValue(mockWithNonUserId);
    request(app)
      .get('/recipe/12')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body).toStrictEqual({ recipe: mockWithNonUserId, canEdit: false });
        const { calls } = RecipeManager.getRecipeByIDMock.mock;
        expect(calls[0][0]).toStrictEqual('12');
        done();
      });
  });

  it('gets recipe by id and can edit', (done) => {
    const mockWithUserId = { ...MOCK_RECIPE, userID: 21 };
    RecipeManager.getRecipeByIDMock.mockReturnValue(mockWithUserId);
    request(app)
      .get('/recipe/21')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body).toStrictEqual({ recipe: mockWithUserId, canEdit: true });
        const { calls } = RecipeManager.getRecipeByIDMock.mock;
        expect(calls[0][0]).toStrictEqual('21');
        done();
      });
  });
});

describe('deleting recipes', () => {
  it('calls the db to delete the recipe', (done) => {
    RecipeManager.getRecipesMock.mockReturnValue([{ name: 'Recipe one' }, { name: 'Recipe two' }]);
    request(app)
      .delete('/recipe/12')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body).toStrictEqual({
          successes: [{ msg: 'Successfully deleted recipe' }],
        });
        expect(RecipeManager.deleteRecipeMock.mock.calls[0][0]).toStrictEqual('12');
        expect(RecipeManager.deleteRecipeMock.mock.calls[0][1]).toStrictEqual(21);
        done();
      });
  });
});

describe('updating recipes', () => {
  it('updates a existing recipe', (done) => {
    RecipeManager.updateRecipeMock.mockReturnValue(21);
    request(app)
      .post('/recipe/21/update')
      .send(MOCK_RECIPE)
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body).toStrictEqual({
          successes: [{ msg: `Successfully updated recipe` }],
        });
        const { calls } = RecipeManager.updateRecipeMock.mock;
        expect(calls.length).toBe(1);
        expect(calls[0][0]).toStrictEqual('21');
        expect(calls[0][1]).toStrictEqual(MOCK_RECIPE);
        expect(calls[0][2]).toStrictEqual(21);
        done();
      });
  });
  it('create fails with no name', (done) => {
    request(app)
      .post('/recipe/21/update')
      .send({ description: 'Test Recipe', instructions: [], ingredients: [] })
      .expect(400, done);
  });
  it('create fails with no instructions', (done) => {
    request(app)
      .post('/recipe/21/update')
      .send({ name: 'test', description: 'Test Recipe', ingredients: [] })
      .expect(400, done);
  });
  it('create fails with no name too long', (done) => {
    request(app)
      .post('/recipe/21/update')
      .send({
        name: `THIS STRING IS > 255 CHARACTERS xxxxxxxxxxxxxxxxxxxx
          xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
          xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
          xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
          xxxxxxxxxxxxxxxxx`,
        description: 'Test Recipe',
        ingredients: [],
        instructions: [],
      })
      .expect(400, done);
  });
  it('create fails with quantity not a number', (done) => {
    request(app)
      .post('/recipe/21/update')
      .send({
        name: `Name`,
        description: 'Test Recipe',
        ingredients: [{ itemName: 'Test Item', unit: 'oz', quantity: 'no number' }],
        instructions: [],
      })
      .expect(400, done);
  });
});
