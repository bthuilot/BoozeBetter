class Recipe {
  setID(id) {
    this.id = id;
  }

  getID() {
    return this.id;
  }

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
    this.description = desc;
  }

  getDesc() {
    return this.description;
  }

  toJson() {
    return {
      ingredients: this.ingredients,
      instructions: this.instructions,
      name: this.name,
      description: this.desc,
    };
  }
}

module.exports = Recipe;
