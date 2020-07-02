class AuthManager {
  setUser(req, res, next) {
    req.userID = 21;
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
