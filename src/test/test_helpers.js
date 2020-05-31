function itif(condition) {
  return condition ? it : it.skip;
}

module.exports = { itif };
