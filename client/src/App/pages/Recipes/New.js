import React, { Component } from "react";
import {
  Row,
  Form,
  Col,
  Dropdown,
  DropdownButton,
  Button,
  InputGroup,
} from "react-bootstrap";

const UNITS = ["oz(s)", "gram(s)", "cup(s)", "tsp", "tbsp", "pinch", "dash"];
class NewRecipe extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ingredients: [{ quantity: "1 1/2", unit: "Oz", itemName: "Rum" }],
      instructions: ["Mix items together and shake!"],
      name: "Rum & Coke",
      description: "",
    };
  }

  updateIngredient = (index, updated) => {
    const ingredients = [...this.state.ingredients];
    ingredients[index] = updated;
    this.setState({ ingredients: ingredients });
  };

  updateInstruction = (index, updated) => {
    const instruction = [...this.state.instructions];
    instruction[index] = updated;
    this.setState({ instructions: instruction });
  };

  removeIngredient = (index) => {
    const ingredients = this.state.ingredients.filter((val, i) => i !== index);
    this.setState({ ingredients: ingredients });
  };

  removeInstruction = (index) => {
    const instructions = this.state.instructions.filter(
      (val, i) => i !== index
    );
    this.setState({ instructions: instructions });
  };

  submitNewRecipe = () => {
    // Simple POST request with a JSON body using fetch
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(this.state),
    };
    fetch("/recipes/create", requestOptions)
      .then((response) => response.json())
      .then((data) => this.setState({ postId: data.id }));
  };

  render() {
    return (
      <Row className="align-self-center mx-0 w-100">
        <Col>
          <h2 className="text-center">New Recipe</h2>
        </Col>
        <Form className="w-100">
          <Form.Group controlId="formRecipeEmail">
            <Form.Label>
              <h3>Name</h3>
            </Form.Label>
            <Form.Control type="text" placeholder="Rum & Coke" />
          </Form.Group>

          <Form.Label>
            <h3>Ingredients</h3>
          </Form.Label>
          <Form.Group controlId="Ingredients">
            {this.state.ingredients.map((ingredient, index) => (
              <Row className="mb-3" key={index}>
                <Col xs={12} md={4} className="my-1">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    value={ingredient.itemName}
                    onChange={(event) => {
                      ingredient.itemName = event.target.value;
                      this.updateIngredient(index, ingredient);
                    }}
                  />
                </Col>
                <Col xs={8} m={4} className="my-1">
                  <Form.Label>Amount</Form.Label>
                  <Form.Control
                    value={ingredient.quantity}
                    onChange={(event) => {
                      ingredient.quantity = event.target.value;
                      this.updateIngredient(index, ingredient);
                    }}
                  />
                </Col>
                <Col xs={4} md={2} className="my-1">
                  <Form.Label>Unit</Form.Label>
                  <Form.Control as="select" custom>
                    {UNITS.map((unit) => (
                      <option key={unit}>{unit}</option>
                    ))}
                  </Form.Control>
                </Col>
                <Col xs={2} className="text-center h-100 my-1" md={2}>
                  <Button
                    variant="outline-danger"
                    onClick={() => this.removeIngredient(index)}
                  >
                    Remove
                  </Button>
                </Col>
              </Row>
            ))}
            <Row className="my-2">
              <Col>
                <Button
                  variant="outline-dark"
                  class
                  onClick={() => {
                    this.setState({
                      ingredients: [...this.state.ingredients, {}],
                    });
                  }}
                >
                  Add Ingredient
                </Button>
              </Col>
            </Row>
          </Form.Group>

          <Form.Label>
            <h3>Instructions</h3>
          </Form.Label>
          <Form.Group controlId="Instructions">
            {this.state.instructions.map((instruction, index) => (
              <Row key={index}>
                <Col xs={12} md={10}>
                  <InputGroup className="mb-3">
                    <InputGroup.Prepend>
                      <InputGroup.Text id="basic-addon1">
                        {index + 1}
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control
                      value={instruction}
                      onChange={(event) => {
                        instruction = event.target.value;
                        this.updateInstruction(index, instruction);
                      }}
                    />
                  </InputGroup>
                </Col>
                <Col xs={2} className="text-center h-100">
                  <Button
                    variant="outline-danger"
                    onClick={() => this.removeInstruction(index)}
                  >
                    Remove
                  </Button>
                </Col>
              </Row>
            ))}
            <Row className="my-2">
              <Col>
                <Button
                  variant="outline-dark"
                  class
                  onClick={() => {
                    this.setState({
                      instructions: [...this.state.instructions, ""],
                    });
                  }}
                >
                  Add Instruction
                </Button>
              </Col>
            </Row>
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            onClick={this.submitNewRecipe}
          >
            Submit
          </Button>
        </Form>
      </Row>
    );
  }
}
export default NewRecipe;
