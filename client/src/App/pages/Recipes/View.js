import React, { Component } from "react";
import {
  Container,
  Row,
  Col,
  Spinner,
  InputGroup,
  ListGroup,
  FormControl,
  Button,
} from "react-bootstrap";
import { AlertDisplay } from "../../hooks/AlertDisplay/AlertDisplay";
import { Header } from "../../hooks/Header/Header";
import { formatErrors } from "../../helpers";
import { useParams } from "react-router-dom";

class ViewRecipe extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: [],
      isLoaded: false,
      recipe: {},
      canEdit: false,
    };

    this.fetchRecipe = this.fetchRecipe.bind(this);
  }

  componentDidMount() {
    const {
      match: { params },
    } = this.props;
    this.fetchRecipe(params.id);
  }

  fetchRecipe(id) {
    fetch(`/recipe/${id}`, {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((result) => {
        if (!result.errors) {
          this.setState({ isLoaded: true, recipe: result.recipe });
        } else {
          this.setState({
            errors: result.errors.map(formatErrors),
          });
        }
      })
      .catch((err) => {
        this.setState({
          errors: ["An unknown error occured"],
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

  renderRecipeContents(recipe) {
    return (
      <>
        <Col xs={12} md={8} className="text-center my-3">
          <h1>{recipe.name}</h1>
        </Col>
        <Col xs={12} md={6} className="my-3 text-center justify-content-center">
          <p>{recipe.description}</p>
        </Col>
        <Col xs={12}></Col>
        <Col xs={6}>
          <hr className="mt-2 mb-3" />
        </Col>
        <Col xs={12}></Col>
        <Col xs={6}>
          <hr className="mt-2 mb-3" />
        </Col>
        <Col xs={12}></Col>
        <Col xs={12} md={6} className="my-2">
          <h3>Ingredients</h3>
        </Col>
        <Col xs={12}></Col>
        <Col xs={4}>
          <hr className="mt-2 mb-3" />
        </Col>
        <Col xs={12}></Col>
        <Col xs={12} md={5}>
          <ul>
            {recipe.ingredients.map((item, index) => {
              return (
                <li key={index}>
                  {item.quantity} {item.unit} of {item.itemName}
                </li>
              );
            })}
          </ul>
        </Col>
        <Col xs={12}></Col>
        <Col xs={12} md={6} className="my-2">
          <h3>Instructions</h3>
        </Col>
        <Col xs={12}></Col>
        <Col xs={4}>
          <hr className="mt-2 mb-3" />
        </Col>
        <Col xs={12}></Col>
        <Col xs={12} md={5}>
          <ol>
            {recipe.instructions.map((item, index) => {
              return <li key={index}>{item}</li>;
            })}
          </ol>
        </Col>
        <Col xs={12}></Col>
        {recipe.canEdit && (
          <>
            <Col xs={4} md={2} className="my-2 text-center">
              <Button variant="secondary" className="mx-1">
                Edit Recipe
              </Button>
            </Col>
            <Col xs={4} md={2} className="my-2 text-center">
              <Button variant="danger" className="mx-1">
                Delete Recipe
              </Button>
            </Col>
          </>
        )}
      </>
    );
  }

  renderRecipe() {
    return (
      <>
        {this.state.isLoaded
          ? this.renderRecipeContents(this.state.recipe)
          : this.renderSpinner()}
      </>
    );
  }

  render() {
    return (
      <Container fluid className="w-100 p-0">
        <Header variant="dark" bg="dark" sticky="top" showsearch />
        <>
          <Row className="justify-content-center align-self-center mx-0 w-100">
            <Col xs={12}>
              <AlertDisplay
                errors={this.state.errors}
                successes={this.state.successes}
              ></AlertDisplay>
            </Col>
            {this.renderRecipe()}
          </Row>
        </>
      </Container>
    );
  }
}
export default ViewRecipe;
