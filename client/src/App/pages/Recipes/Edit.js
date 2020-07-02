import React, { Component } from 'react';
import { Container, Row, Col, Form, Button, Spinner, Alert, InputGroup } from 'react-bootstrap';
import { Link, Redirect } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Header } from '../../hooks/Header/Header';
import { formatErrors } from '../../helpers';
import { RequiresSignin } from '../../hooks/RequiresSignin/RequiresSignin';

const UNITS = ['oz', 'shot'];

class EditRecipe extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: [],
      updated: false,
      authenticated: false,
      updatedRecipe: {},
      id: -1,
    };

    this.updateRecipe = this.updateRecipe.bind(this);
    this.updateIngredient = this.updateIngredient.bind(this);
    this.updateInstruction = this.updateInstruction.bind(this);
    this.removeIngredient = this.removeIngredient.bind(this);
    this.removeInstruction = this.removeInstruction.bind(this);
  }

  componentDidMount() {
    const {
      match: { params },
    } = this.props;
    this.setState({ id: params.id });
    this.fetchRecipe(params.id);
  }

  fetchRecipe(id) {
    fetch(`/recipe/${id}`, {
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((result) => {
        if (!result.errors) {
          const { recipe, canEdit } = result;
          this.setState({
            isLoaded: true,
            updatedRecipe: recipe,
            authenticated: canEdit,
            id: recipe.id,
          });
        } else {
          this.setState({
            isLoaded: true,
            errors: result.errors.map(formatErrors),
          });
        }
      })
      .catch((err) => {
        this.setState({
          errors: ['An unknown error occured'],
        });
      });
  }

  renderSpinner() {
    return (
      <Col xs={12} className="text-center justify-content-center">
        <Spinner animation="border" className="orange-spinner" size="lg" />
      </Col>
    );
  }

  updateRecipe(event) {
    console.log('here');
    this.setState({ errors: [] });
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(this.state.updatedRecipe),
      credentials: 'include',
    };

    fetch(`/recipe/${this.state.id}/update`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (!result.errors) {
          this.setState({ updated: true });
        } else {
          this.setState({
            errors: result.errors.map(formatErrors),
          });
        }
      })
      .catch((err) => {
        console.log(err);
        this.setState({
          errors: [{ msg: 'An unknown error occured' }],
        });
      });
    event.preventDefault();
  }

  assignToRecipe(event, property) {
    const { updatedRecipe } = this.state;
    updatedRecipe[property] = event.target.value;
    this.setState({ updatedRecipe });
  }

  updateIngredient(index, updated) {
    const updatedRecipe = { ...this.state.updatedRecipe };
    const { ingredients } = updatedRecipe;
    Object.assign(ingredients[index], updated);
    this.setState({ updatedRecipe });
  }

  updateInstruction(index, updated) {
    const updatedRecipe = { ...this.state.updatedRecipe };
    const { instructions } = updatedRecipe;
    instructions[index] = updated;
    this.setState({ updatedRecipe });
  }

  removeIngredient(index) {
    const updatedRecipe = { ...this.state.updatedRecipe };
    updatedRecipe.ingredients = updatedRecipe.ingredients.filter((val, i) => i !== index);
    this.setState({ updatedRecipe });
  }

  removeInstruction(index) {
    const updatedRecipe = { ...this.state.updatedRecipe };
    updatedRecipe.instructions = updatedRecipe.instructions.filter((val, i) => i !== index);
    this.setState({ updatedRecipe });
  }

  redirectTo(msg, link) {
    return (
      <Redirect
        push
        to={{
          pathname: link,
          state: { successes: [msg] },
        }}
      />
    );
  }

  renderNotViewable() {
    return (
      <Row className="align-self-center mx-0 w-100">
        <Col>
          <Row className="mb-3">
            <Col className="justify-content-center text-center">
              <h3 className="text-center">Please login to continue</h3>
            </Col>
          </Row>
          <Row className="mb-3 justify-content-center">
            <Col xs={1} className="justify-content-center text-center">
              <Link
                className="text-center"
                to={{
                  pathname: '/login',
                }}
              >
                Login
              </Link>
            </Col>
            <Col xs={1} className="justify-content-center text-center">
              <Link
                className="text-center"
                to={{
                  pathname: '/register',
                }}
              >
                Register
              </Link>
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }

  renderEditForm() {
    return (
      <Container fluid className={this.state.authenticated ? 'p-0' : 'd-flex h-100 w-100'}>
        <Header
          variant="dark"
          bg="dark"
          sticky={this.state.authenticated && 'top'}
          fixed={!this.state.authenticated && 'top'}
          showsearch
        />
        <Row className="my-4">
          <Col xs={12}>
            <h1 className="text-center">Edit Recipe</h1>
          </Col>
        </Row>
        <Row>
          <Col xs={10}>
            {this.state.errors.map((err) => (
              <Alert key="error" variant="danger">
                {err.msg}
              </Alert>
            ))}
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col xs={10}>
            <Form onSubmit={this.updateRecipe}>
              <Form.Group controlId="formRecipeEmail">
                <Form.Label>
                  <h3>Name</h3>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="ex. Rum & Coke"
                  defaultValue={this.state.updatedRecipe.name}
                  onChange={(event) => {
                    this.assignToRecipe(event, 'name');
                  }}
                />
                <Form.Label className="my-2">
                  <h3>Description</h3>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Write small a description of your drink!"
                  defaultValue={this.state.updatedRecipe.description}
                  onChange={(event) => {
                    this.assignToRecipe(event, 'description');
                  }}
                />
              </Form.Group>

              <Form.Label>
                <h3>Ingredients</h3>
              </Form.Label>
              <Form.Group controlId="Ingredients">
                {this.state.updatedRecipe.ingredients.map((ingredient, index) => (
                  <Row className="mb-3" key={index}>
                    <Col xs={12} md={4} className="my-1">
                      <Form.Label>Name</Form.Label>
                      <Form.Control
                        value={ingredient.itemName}
                        onChange={(event) => {
                          const itemName = event.target.value;
                          this.updateIngredient(index, { itemName });
                        }}
                      />
                    </Col>
                    <Col xs={8} m={4} className="my-1">
                      <Form.Label>Amount</Form.Label>
                      <Form.Control
                        value={ingredient.quantity}
                        onChange={(event) => {
                          const quantity = event.target.value;
                          this.updateIngredient(index, { quantity });
                        }}
                      />
                    </Col>
                    <Col xs={4} md={2} className="my-1">
                      <Form.Label>Unit</Form.Label>
                      <Form.Control
                        as="select"
                        custom
                        value={ingredient.unit}
                        onChange={(event) => {
                          const unit = event.target.value;
                          this.updateIngredient(index, { unit });
                        }}
                      >
                        {UNITS.map((unit) => (
                          <option key={unit}>{unit}</option>
                        ))}
                      </Form.Control>
                    </Col>
                    <Col xs={2} className="text-center h-100 my-1" md={2}>
                      <Button variant="outline-danger" onClick={() => this.removeIngredient(index)}>
                        Remove
                      </Button>
                    </Col>
                  </Row>
                ))}
                <Row className="my-2">
                  <Col>
                    <Button
                      variant="outline-dark"
                      onClick={() => {
                        const updatedRecipe = { ...this.state.updatedRecipe };
                        updatedRecipe.ingredients = [
                          ...updatedRecipe.ingredients,
                          { unit: UNITS[0] },
                        ];
                        this.setState({
                          updatedRecipe,
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
                {this.state.updatedRecipe.instructions.map((instruction, index) => (
                  <Row key={index}>
                    <Col xs={12} md={10}>
                      <InputGroup className="mb-3">
                        <InputGroup.Prepend>
                          <InputGroup.Text id="basic-addon1">{index + 1}</InputGroup.Text>
                        </InputGroup.Prepend>
                        <Form.Control
                          value={instruction}
                          onChange={(event) => {
                            const updatedInstruction = event.target.value;
                            this.updateInstruction(index, updatedInstruction);
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
                      onClick={() => {
                        const updatedRecipe = { ...this.state.updatedRecipe };
                        updatedRecipe.instructions = [...updatedRecipe.instructions, ''];
                        this.setState({
                          updatedRecipe,
                        });
                      }}
                    >
                      Add Instruction
                    </Button>
                  </Col>
                </Row>
              </Form.Group>
              <Form.Group className="mb-3">
                <Button variant="primary" type="submit" className="mr-2">
                  Submit
                </Button>
                <Button variant="secondary" className="ml-2" href={`/recipes/${this.state.id}`}>
                  Cancel
                </Button>
              </Form.Group>
            </Form>
          </Col>
        </Row>
      </Container>
    );
  }

  render() {
    if (this.state.updated) {
      this.setState({ updated: false });
      return this.redirectTo('Recipe updated', `/recipes/${this.state.id}`);
    }

    if (!this.state.authenticated) {
      return (
        <Container fluid className="d-flex h-100 w-100">
          <Header fixed="top" showsearch variant="dark" bg="dark" />
          <RequiresSignin />
        </Container>
      );
    }

    return (
      <Container fluid className="d-flex h-100 w-100">
        <Header fixed="top" showsearch variant="dark" bg="dark" />
        {this.state.isLoaded ? this.renderEditForm() : this.renderSpinner()}
      </Container>
    );
  }
}

export default EditRecipe;
