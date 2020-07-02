import React, { Component } from 'react';
import { Container, Row, Col, Spinner, Button } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import AlertDisplay from '../../hooks/AlertDisplay/AlertDisplay';
import { Header } from '../../hooks/Header/Header';
import { formatErrors } from '../../helpers';

class ViewRecipe extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: [],
      isLoaded: false,
      recipe: {},
      canEdit: false,
      deleted: false,
      notFound: false,
    };

    this.fetchRecipe = this.fetchRecipe.bind(this);
    this.delete = this.delete.bind(this);
  }

  componentDidMount() {
    const {
      match: { params },
    } = this.props;
    this.fetchRecipe(params.id);
  }

  fetchRecipe(id) {
    fetch(`/recipe/${id}`, {
      credentials: 'include',
    })
      .then((response) => {
        const res = response.json();
        res.status = response.status;
        return res;
      })
      .then((result) => {
        if (!result.errors) {
          this.setState({
            recipe: result.recipe,
            isLoaded: true,
            canEdit: result.canEdit,
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

  delete() {
    const requestOptions = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    };
    fetch(`/recipe/${this.state.recipe.id}`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if (res.errors) {
          this.setState({ errors: res.errors.map(formatErrors) });
          return;
        }
        this.setState({ deleted: true });
      })
      .catch(() => {
        this.setState({
          errors: [
            {
              msg:
                'Error occurred while trying to delete the account. Reload the page and try again',
            },
          ],
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
    if (this.state.errors.length > 0) {
      return (
        <Col xs={12} md={8} className="text-center my-3">
          <h1>There was an error with your request :(</h1>
        </Col>
      );
    }
    return (
      <>
        <Col xs={12} md={8} className="text-center my-3">
          <h1>{this.state.recipe.name}</h1>
        </Col>
        <Col xs={12} md={6} className="my-3 text-center justify-content-center">
          <p>{this.state.recipe.description}</p>
        </Col>
        <Col xs={12} />
        <Col xs={6}>
          <hr className="mt-2 mb-3" />
        </Col>
        <Col xs={12} />
        <Col xs={6}>
          <hr className="mt-2 mb-3" />
        </Col>
        <Col xs={12} />
        <Col xs={12} md={6} className="my-2">
          <h3>Ingredients</h3>
        </Col>
        <Col xs={12} />
        <Col xs={4}>
          <hr className="mt-2 mb-3" />
        </Col>
        <Col xs={12} />
        <Col xs={12} md={5}>
          <ul>
            {this.state.recipe.ingredients.map((item, index) => {
              return (
                <li key={index}>
                  {item.quantity} {item.unit} of {item.itemName}
                </li>
              );
            })}
          </ul>
        </Col>
        <Col xs={12} />
        <Col xs={12} md={6} className="my-2">
          <h3>Instructions</h3>
        </Col>
        <Col xs={12} />
        <Col xs={4}>
          <hr className="mt-2 mb-3" />
        </Col>
        <Col xs={12} />
        <Col xs={12} md={5}>
          <ol>
            {this.state.recipe.instructions.map((item, index) => {
              return <li key={index}>{item}</li>;
            })}
          </ol>
        </Col>
        <Col xs={12} />
        {this.state.canEdit && (
          <>
            <Col xs={4} md={2} className="my-2 text-center">
              <Button
                variant="secondary"
                className="mx-1"
                href={`/recipes/${this.state.recipe.id}/edit`}
              >
                Edit Recipe
              </Button>
            </Col>
            <Col xs={4} md={2} className="my-2 text-center">
              <Button variant="danger" className="mx-1" onClick={this.delete}>
                Delete Recipe
              </Button>
            </Col>
          </>
        )}
      </>
    );
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

  renderRecipe() {
    return <>{this.state.isLoaded ? this.renderRecipeContents() : this.renderSpinner()}</>;
  }

  render() {
    if (this.state.deleted) {
      this.setState({ deleted: false });
      return this.redirectTo('Recipe deleted', '/recipes/new');
    }
    return (
      <Container fluid className="w-100 p-0">
        <Header variant="dark" bg="dark" sticky="top" showsearch />
        <>
          <Row className="justify-content-center align-self-center mx-0 w-100">
            <Col xs={12}>
              <AlertDisplay errors={this.state.errors} successes={this.state.successes} />
            </Col>
            {this.renderRecipe()}
          </Row>
        </>
      </Container>
    );
  }
}
export default ViewRecipe;
