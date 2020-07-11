class UserManager {
  constructor(dao, recipeDAO) {
    this.dao = dao;
    this.recipeDAO = recipeDAO;
  }

  emailExists(email) {
    return this.dao.doesEmailExist(email);
  }

  login(email, password) {
    return this.dao.login(email, password);
  }

  createNewUser(userJson) {
    return this.dao.createUser(userJson);
  }

  async getAccountDetails(userID) {
    const user = await this.dao.getAccountDetails(userID);
    if (user.id === -1) {
      throw new Error(`No user with ID ${userID}`);
    }
    const recipes = await this.recipeDAO.getRecipesByUserID(userID);
    user.recipes = recipes;
    return user;
  }

  async deleteUser(userID, password) {
    const login = await this.dao.loginWithID(userID, password);
    if (login === -1) {
      return -1;
    }
    return this.dao.deleteUser(userID);
  }

  async updateUser(userID, user, updatePassword) {
    const login = await this.dao.loginWithID(userID, user.password);
    if (login === -1) {
      return -1;
    }
    return this.dao.updateUser(userID, user, updatePassword);
  }
}

module.exports = UserManager;
