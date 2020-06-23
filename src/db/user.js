const crypto = require('crypto');

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
    } else {
      return { id: -1 };
    }
  }

  async deleteUser(userID) {
    const result = await this.db.runQuery(DELETE_USER, [userID]);
    if (result.rowCount === 1) {
      return userID;
    } else {
      return -1;
    }
  }

  async login(email, password) {
    const salt = await this.db.runQuery(GET_USER_SALT, [email]);
    if (salt.rows.length === 1) {
      const password_salt = salt.rows[0].password_salt;
      const hashedPassword = this.getHashedPassword(password + password_salt);
      const user = await this.db.runQuery(LOGIN_USER, [email, hashedPassword]);
      if (user.rows.length === 1) {
        return user.rows[0].id;
      } else {
        return -1;
      }
    } else {
      return -1;
    }
  }

  async loginWithID(id, password) {
    const salt = await this.db.runQuery(GET_USER_SALT_BY_ID, [id]);
    if (salt.rows.length === 1) {
      const password_salt = salt.rows[0].password_salt;
      const hashedPassword = this.getHashedPassword(password + password_salt);
      const user = await this.db.runQuery(LOGIN_USER_WITH_ID, [id, hashedPassword]);
      if (user.rows.length === 1) {
        return user.rows[0].id;
      } else {
        return -1;
      }
    } else {
      return -1;
    }
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
      return -1;
    }
    if (updatePassword) {
      const { password_salt } = salt.rows[0];
      const updatedHash = this.getHashedPassword(updatedPassword + password_salt);
      result = await this.db.runQuery(UPDATE_USER_DETAILS_AND_PASSWORD, [
        email,
        displayName,
        updatedHash,
        userID,
      ]);
    } else {
      result = await this.db.runQuery(UPDATE_USER_DETAILS, [email, displayName, userID]);
    }
    return result.rowCount === 1 ? userID : -1;
  }

  async createUser(user) {
    const salt = this.generateSalt();
    const passwordHash = this.getHashedPassword(user.password + salt);
    const id = await this.db.runQuery(CREATE_USER, [
      user.email,
      passwordHash,
      salt,
      user.displayName ? user.displayName : '',
    ]);
    return id.rows[0].id;
  }

  generateSalt() {
    return crypto.randomBytes(4).toString('hex');
  }

  getHashedPassword(password) {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash;
  }
}

module.exports = UserDAO;
