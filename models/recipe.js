class Recipe {
  getInstructions() {
    return this.instructions;
  }

  setInstructions(instructions) {
    this.instructions = instructions;
  }

  getIngredients() {
    return this.ingredients;
  }

  setIngredients(ingredients) {
    this.ingredients = ingredients;
  }

  setName(name) {
    this.name = name;
  }

  getName() {
    return this.name;
  }

  setDesc(desc) {
    this.desc = desc;
  }

  getDesc() {
    return this.desc;
  }

  toJson() {
    return {
      ingredients: this.ingredients,
      instructions: this.instructions,
      name: this.name,
      desc: this.desc,
    };
  }
}

module.exports = Recipe;
