class UserManager{
  static emailExistsMock = jest.fn();
  static loginMock = jest.fn();
  static createNewUserMock = jest.fn();
  static getAccountDetailsMock = jest.fn();
  static deleteUserMock = jest.fn();
  static updateUserMock = jest.fn();

  emailExists(email) {
    return new Promise(r => r(UserManager.emailExistsMock(email)));
  }

  login(email, password) {
    return new Promise(r => r(UserManager.loginMock(email, password)));
  }

  createNewUser(userJson) {
    return new Promise(r => r(UserManager.createNewUserMock(userJson)));
  }

  async getAccountDetails(userID) {
    return new Promise(r => r(UserManager.getAccountDetailsMock(userID)));
  }

  async deleteUser(userID, password) {
    return new Promise(r => r(UserManager.deleteUserMock(userID, password)));
  }

  async updateUser(userID, user, updatePassword) {
    return new Promise(r => r(UserManager.updateUserMock(userID, user, updatePassword)));
  }
}

module.exports = UserManager;
