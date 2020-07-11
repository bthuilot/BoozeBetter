const crypto = require('crypto');

class AuthManager {
  constructor() {
    this.authTokens = [];
    this.setUser = this.setUser.bind(this);
    this.getUserID = this.getUserID.bind(this);
    this.assignUserID = this.assignUserID.bind(this);
    this.createToken = this.createToken.bind(this);
    this.removeCookie = this.removeCookie.bind(this);
  }

  setUser(req, res, next) {
    const authToken = req.cookies.AuthToken;

    req.userID = this.authTokens[authToken];
    next();
  }

  removeCookie(req, res, next) {
    const token = req.cookies.AuthToken;
    if (token) {
      delete this.authTokens[token];
    }
    res.clearCookie('AuthToken');
    next();
  }

  getUserID(token) {
    return this.authTokens[token];
  }

  assignUserID(token, userID) {
    this.authTokens[token] = userID;
  }

  static generateAuthToken() {
    return crypto.randomBytes(32).toString('hex');
  }

  createToken(userID, res) {
    const authToken = AuthManager.generateAuthToken();

    this.authTokens[authToken] = userID;
    res.cookie('AuthToken', authToken, { maxAge: 86400000 });
  }
}

module.exports = AuthManager;
