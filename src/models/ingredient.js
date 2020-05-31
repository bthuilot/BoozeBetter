class Ingredient {
  setItemName(itemName) {
    this.itemName = itemName;
  }

  getItemName() {
    return this.itemName;
  }

  setUnit(unit) {
    this.unit = unit;
  }

  getUnit() {
    return this.unit;
  }

  setQuantity(quantity) {
    this.quantity = quantity;
  }

  getQuantity() {
    return this.quantity;
  }

  toJson() {
    return {
      itemName: this.itemName,
      unit: this.unit,
      quantity: this.quantity,
    };
  }
}

module.exports = Ingredient;
