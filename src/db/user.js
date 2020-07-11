const crypto = require('crypto');
const NotFoundError = require('../types/errors/notFound');
const NotAuthenticated = require('../types/errors/notAuthenticated');

const LOGIN_USER = `
SELECT 
id
FROM 
users
WHERE
email = $1 AND password_hash = $2
`;

const LOGIN_USER_WITH_ID = `
SELECT 
id
FROM 
users
WHERE
id = $1 AND password_hash = $2
`;

const DOES_EMAIL_EXIST = `
SELECT
id
FROM 
users
WHERE 
email = $1
`;

const GET_ACCOUNT_DETAILS_BY_USER_ID = `
SELECT
email,
display_name
FROM
users
WHERE 
id = $1
`;

const DELETE_USER = `
DELETE
FROM 
users
WHERE
id = $1
`;

const UPDATE_USER_DETAILS = `
UPDATE
users
SET
email = $1, display_name = $2
WHERE
id = $3
`;

const UPDATE_USER_DETAILS_AND_PASSWORD = `
UPDATE
users
SET
email = $1, display_name = $2, password_hash = $3
WHERE
id = $4
`;

const GET_USER_SALT = `
SELECT
password_salt
FROM
users
WHERE
email = $1
`;

const GET_USER_SALT_BY_ID = `
SELECT
password_salt
FROM
users
WHERE
id = $1
`;

const CREATE_USER = `
INSERT INTO users (email, password_hash, password_salt, display_name)
VALUES ($1, $2, $3, $4) RETURNING id
`;

class UserDAO {
  constructor(database) {
    this.db = database;
  }

  async getAccountDetails(userID) {
    const result = await this.db.runQuery(GET_ACCOUNT_DETAILS_BY_USER_ID, [userID]);
    if (result.rows.length === 1) {
      return result.rows[0];
    }
    throw new NotFoundError(`Account with id ${userID} not found`);
  }

  async deleteUser(userID) {
    const result = await this.db.runQuery(DELETE_USER, [userID]);
    if (result.rowCount === 1) {
      return userID;
    }
    throw new NotFoundError('The user was not found');
  }

  async login(email, password) {
    const salt = await this.db.runQuery(GET_USER_SALT, [email]);
    if (salt.rows.length === 1) {
      const passwordSalt = salt.rows[0].password_salt;
      const hashedPassword = UserDAO.getHashedPassword(password + passwordSalt);
      const user = await this.db.runQuery(LOGIN_USER, [email, hashedPassword]);
      if (user.rows.length === 1) {
        return user.rows[0].id;
      }
    }
    throw new NotAuthenticated(
      'Either the username or passowrd was not correct or the user with that email does not exist'
    );
  }

  async loginWithID(id, password) {
    const salt = await this.db.runQuery(GET_USER_SALT_BY_ID, [id]);
    if (salt.rows.length === 1) {
      const passwordSalt = salt.rows[0].password_salt;
      const hashedPassword = UserDAO.getHashedPassword(password + passwordSalt);
      const user = await this.db.runQuery(LOGIN_USER_WITH_ID, [id, hashedPassword]);
      if (user.rows.length === 1) {
        return user.rows[0].id;
      }
    }
    throw new NotAuthenticated(
      'Either the username or passowrd was not correct or the user with that email does not exist'
    );
  }

  async doesEmailExist(email) {
    const result = await this.db.runQuery(DOES_EMAIL_EXIST, [email]);
    return result.rows.length === 1;
  }

  async updateUser(userID, user, updatePassword) {
    let result;
    const { email, displayName, updatedPassword } = user;
    const salt = await this.db.runQuery(GET_USER_SALT_BY_ID, [userID]);
    if (salt.rows.length !== 1) {
      throw new NotFoundError('The user was unable to be found');
    }
    if (updatePassword) {
      const passwordSalt = salt.rows[0].password_salt;
      const updatedHash = UserDAO.getHashedPassword(updatedPassword + passwordSalt);
      result = await this.db.runQuery(UPDATE_USER_DETAILS_AND_PASSWORD, [
        email,
        displayName,
        updatedHash,
        userID,
      ]);
    } else {
      result = await this.db.runQuery(UPDATE_USER_DETAILS, [email, displayName, userID]);
    }
    if (result.rowCount === 1) {
      return userID;
    }
    throw new NotFoundError('The user was unable to be found');
  }

  async createUser(user) {
    const salt = UserDAO.generateSalt();
    const passwordHash = UserDAO.getHashedPassword(user.password + salt);
    const id = await this.db.runQuery(CREATE_USER, [
      user.email,
      passwordHash,
      salt,
      user.displayName ? user.displayName : '',
    ]);
    return id.rows[0].id;
  }

  static generateSalt() {
    return crypto.randomBytes(4).toString('hex');
  }

  static getHashedPassword(password) {
    const sha256 = crypto.createHash('sha256');
    return sha256.update(password).digest('base64');
  }
}

module.exports = UserDAO;
