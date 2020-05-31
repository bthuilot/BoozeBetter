class Instruction {
  getDesc() {
    return this.desc;
  }

  setDesc(desc) {
    this.desc = desc;
  }

  toJson() {
    return {
      desc: this.desc,
    };
  }
}

module.exports = Instruction;
