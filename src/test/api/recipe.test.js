const request = require('supertest');
const { serve } = require('../../server');

let app;
let mockDB;

beforeAll(() => {
  mockDB = { runQuery: jest.fn() };
  app = serve(mockDB);
});

beforeEach(() => {
  mockDB.runQuery.mockReset();
  mockDB.runQuery.mockResolvedValue(true);
});

describe('creating recipes', () => {
  it('create new recipe', (done) => {
    mockDB.runQuery.mockResolvedValueOnce({ rows: [{ id: 21 }] });

    request(app)
      .post('/recipes/create')
      .send({
        name: 'Test',
        description: 'Test Recipe',
        instructions: ['Test Instruction'],
        ingredients: [{ itemName: 'Test Item', unit: 'oz', quantity: '1/3' }],
        user_id: 1,
      })
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body.id).toBe(21);
        expect(response.body.message).toBe('Succesfully created recipe with id 21');
        const { calls } = mockDB.runQuery.mock;
        expect(calls.length).toBe(3);
        expect(calls[0].length).toBe(2);
        expect(calls[0][1]).toEqual(['Test', 'Test Recipe', 1]);
        expect(calls[1][1]).toEqual([21, 'Test Item', 'oz', '1/3']);
        expect(calls[2][1]).toEqual([21, 'Test Instruction', 1]);
        done();
      });
  });
  it('create fails with no name', (done) => {
    request(app)
      .post('/recipes/create')
      .send({ description: 'Test Recipe', instructions: [], ingredients: [] })
      .expect(422, done);
  });
  it('create fails with no instructions', (done) => {
    request(app)
      .post('/recipes/create')
      .send({ name: 'test', description: 'Test Recipe', ingredients: [] })
      .expect(422, done);
  });
  it('create fails with no name too long', (done) => {
    request(app)
      .post('/recipes/create')
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
      .expect(422, done);
  });
  it('create fails with quantity not a number', (done) => {
    request(app)
      .post('/recipes/create')
      .send({
        name: `Name`,
        description: 'Test Recipe',
        ingredients: [{ itemName: 'Test Item', unit: 'oz', quantity: 'no number' }],
        instructions: [],
      })
      .expect(422, done);
  });
});
