const request = require('supertest');
const { serve } = require('../../server');

jest.mock('../../managers/auth');
jest.mock('../../managers/user');
const UserManager = require('../../managers/user');
const AuthManager = require('../../managers/auth');

let app;

beforeAll(() => {
  app = serve();
});

const MOCK_USER = {
  displayName: 'Test',
  email: 'test@example.com',
  password: 'Test1234',
  confirmPassword: 'Test1234',
};

const UPDATED_USER = {
  displayName: 'Test',
  email: 'test@example.com',
  password: 'Test1234',
  updatedPassword: 'Test!1234',
  confirmPassword: 'Test!1234',
}

beforeEach(() => {
  UserManager.emailExistsMock.mockClear();
  UserManager.loginMock.mockClear();
  UserManager.createNewUserMock.mockClear();
  UserManager.getAccountDetailsMock.mockClear();
  UserManager.deleteUserMock.mockClear();
  UserManager.updateUserMock.mockClear();
  AuthManager.number = 21;
});

describe('creating user', () => {
  it('create new user', (done) => {
    UserManager.createNewUserMock.mockReturnValue(21);
    UserManager.emailExistsMock.mockReturnValue(false);
    request(app)
      .post('/register')
      .send({ user: MOCK_USER, acceptTerms: true, legalToDrink: true })
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body.id).toBe(21);
        const { calls } = UserManager.createNewUserMock.mock;
        expect(calls.length).toBe(1);
        const { confirmPassword, ...userNoConfirmPassword } = MOCK_USER;
        expect(calls[0][0]).toStrictEqual(userNoConfirmPassword);
        done();
      });
  });
  it('fails with duplicate email', (done) => {
    UserManager.createNewUserMock.mockReturnValue(21);
    UserManager.emailExistsMock.mockReturnValue(true);
    request(app)
      .post('/register')
      .send({ user: MOCK_USER, acceptTerms: true, legalToDrink: true })
      .expect('Content-Type', /json/)
      .expect(500)
      .then((response) => {
        expect(response.body).toStrictEqual({
          errors: [{ msg: 'An unknown error occurred while creating user' }],
        });
        done();
      });
  });
  it('create fails with no email', (done) => {
    request(app)
      .post('/register')
      .send({ password: 'Test1234', confirmPassword: 'Test1234', displayName: 'test' })
      .expect(400, done);
  });
  it('create fails with no password', (done) => {
    request(app)
      .post('/register')
      .send({ email: 'test@example.com', confirmPassword: 'Test1234', displayName: 'test' })
      .expect(400, done);
  });
  it('create fails with password not having correct length', (done) => {
    request(app)
      .post('/register')
      .send({
        email: 'test@example.com',
        password: 'Test123',
        confirmPassword: 'Test123',
        displayName: 'test',
      })
      .expect(400, done);
  });
  it('create fails with password not having capital', (done) => {
    request(app)
      .post('/register')
      .send({
        email: 'test@example.com',
        password: 'test1234',
        confirmPassword: 'test1234',
        displayName: 'test',
      })
      .expect(400, done);
  });
  it('create fails with password not having numbers', (done) => {
    request(app)
      .post('/register')
      .send({
        email: 'test@example.com',
        password: 'testTest',
        confirmPassword: 'testTest',
        displayName: 'test',
      })
      .expect(400, done);
  });
  it('create fails with passwords not matching', (done) => {
    request(app)
      .post('/register')
      .send({
        email: 'test@example.com',
        password: 'test1234Test',
        confirmPassword: 'testTest',
        displayName: 'test',
      })
      .expect(400, done);
  });
});

describe('get account details', () => {
  it('fails if not logged in', (done) => {
    AuthManager.number = null;
    request(app)
      .get('/account/details')
      .expect('Content-Type', /json/)
      .expect(403)
      .then((response) => {
        expect(response.body.errors).toStrictEqual(
          [{ msg: 'You must be logged to perform this action' }],
        );
        done();
      });
  });

  it('gets account details', (done) => {
    UserManager.getAccountDetailsMock.mockReturnValue(MOCK_USER)
    request(app)
      .get('/account/details')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body.account).toStrictEqual(MOCK_USER);
        const { calls } = UserManager.getAccountDetailsMock.mock;
        expect(calls.length).toBe(1);
        expect(calls[0][0]).toBe(21);
        done();
      });
  });
});

describe('logging in user', () => {
    it('logins if already logged in', (done) => {
        request(app)
            .post('/login')
            .send({ email: 'test@example.com', password: 'Test1234' })
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
                expect(response.body.id).toBe(21);
                const { calls } = UserManager.loginMock.mock;
                expect(calls.length).toBe(0);
                done();
            });
    });

    it('logins using manager', (done) => {
        AuthManager.number = null;
        UserManager.loginMock.mockReturnValue(21);
        request(app)
            .post('/login')
            .send({ email: 'test@example.com', password: 'Test1234' })
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
                expect(response.body.id).toBe(21);
                const { calls } = UserManager.loginMock.mock;
                expect(calls.length).toBe(1);
                expect(calls[0][0]).toBe('test@example.com');
                expect(calls[0][1]).toBe('Test1234');
                done();
            });
    });

    it('email must be an email', (done) => {
        request(app)
            .post('/login')
            .send({ email: 'test@example', password: 'Test1234' })
            .expect('Content-Type', /json/)
            .expect(400, done)
    });

    it('password must contain one capital', (done) => {
        request(app)
            .post('/login')
            .send({ email: 'test@example.com', password: 'test1234' })
            .expect('Content-Type', /json/)
            .expect(400, done)
    });
    it('password must contain one number', (done) => {
        request(app)
            .post('/login')
            .send({ email: 'test@example.com', password: 'Testtest' })
            .expect('Content-Type', /json/)
            .expect(400, done)
    });
});


describe('updating user', () => {
  it('update existing user', (done) => {
    UserManager.updateUserMock.mockReturnValue(21);
    request(app)
      .post('/account/update')
      .send({ user: UPDATED_USER, updatePassword: true })
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body).toStrictEqual({ successes: [{ msg: 'Successfully updated user' }] });
        const { calls } = UserManager.updateUserMock.mock;
        expect(calls.length).toBe(1);
        expect(calls[0][0]).toStrictEqual(21);
        expect(calls[0][1]).toStrictEqual(UPDATED_USER);
        expect(calls[0][2]).toStrictEqual(true);
        done();
      });
  });
  it('fails with no update password', (done) => {
    request(app)
      .post('/account/update')
      .send({ user: UPDATED_USER})
      .expect('Content-Type', /json/)
      .expect(400, done)
  });
  it('update fails with no email', (done) => {
    const {userNoEmail, ...email} = UPDATED_USER
    request(app)
      .post('/account/update')
      .send({ user: userNoEmail })
      .expect(400, done);
  });
});


describe('deleting user', () => {
  it('fails if not logged in', (done) => {
    AuthManager.number = null;
    request(app)
      .delete('/account')
      .send({password: 'Test1234'})
      .expect('Content-Type', /json/)
      .expect(403)
      .then((response) => {
        expect(response.body.errors).toStrictEqual(
          [{ msg: 'You must be logged to perform this action' }],
        );
        done();
      });
  });

  it('fails if no password is given', (done) => {
    request(app)
      .delete('/account')
      .expect('Content-Type', /json/)
      .expect(400, done)
  });

  it('deletes account', (done) => {
    UserManager.deleteUserMock.mockReturnValue(21)
    request(app)
      .delete('/account')
      .send({password: 'Test1234'})
      .expect('Content-Type', /json/)
      .expect(200, done)
  });
});
