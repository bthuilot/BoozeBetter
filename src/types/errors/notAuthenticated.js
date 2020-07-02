class NotAuthenticated extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotAuthenticated';
  }
}

module.exports = NotAuthenticated;
