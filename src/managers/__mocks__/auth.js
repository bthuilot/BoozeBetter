class AuthManager {
  static number = 21;

  setUser(req, res, next) {
    req.userID = AuthManager.number;
    next();
  }


  removeCookie(req, res, next) {
    res.clearCookie('AuthToken');
    next();
  }

  getUserID(token) {
    return 21;
  }

  assignUserID(token, userID) {
  }

  createToken(userID, res) {
  }
}

module.exports = AuthManager;
