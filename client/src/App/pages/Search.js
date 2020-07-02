import React, { Component } from 'react';
import { Row, Card, Col, Button, Spinner, Container } from 'react-bootstrap';
import { parse } from 'query-string';
import { Header } from '../hooks/Header/Header';
import { Sidebar } from '../hooks/Sidebar/Sidebar';
import { RecipeModal } from '../hooks/RecipeModal/RecipeModal';

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      recipes: [],
      params: [],
      showModal: false,
      currentRecipe: { ingredients: [], instructions: [] },
    };
  }

  getTerms(q) {
    return q
      .split(',')
      .map((item) => decodeURIComponent(item))
      .filter((i) => i !== '');
  }

  showModal(recipe) {
    this.setState({ showModal: true, currentRecipe: recipe });
  }

  fetchSearch() {
    const parsed = parse(this.props.location.search);
    fetch(`/recipes?q=${parsed.q}`)
      .then((res) => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            recipes: result,
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error,
          });
        }
      );
    this.setState({ params: parsed.q ? this.getTerms(parsed.q) : [] });
  }

  componentDidMount() {
    this.fetchSearch();
  }

  componentDidUpdate(prevProps) {
    if (this.props.location.search !== prevProps.location.search) {
      this.setState({ isLoaded: false, error: null, recipes: [] });
      this.fetchSearch();
    }
  }

  render() {
    return (
      <Container fluid className="p-0">
        <Header variant="dark" bg="dark" sticky="top" showsearch />
        <RecipeModal show={this.state.showModal} recipe={this.state.currentRecipe} />
        <Row className="justify-content-center">
          <Col md={3} sm={12}>
            <Sidebar tags={this.state.params} />
          </Col>
          <Col md={9} sm={12} className="scrollable">
            <Row className="justify-content-center my-2">
              <Col className="text-center">
                <h2>
                  {this.state.recipes.length}
                  <span role="img" style={{ fontSize: '1.25em' }} aria-label="booze">
                    {' '}
                    🍺
                  </span>
                  's found
                </h2>
              </Col>
            </Row>
            {this.state.recipes.length === 0 && (
              <Row>
                <Col className="text-center">
                  <p>Can't find the one your looking for?</p>
                  <br />
                  <Button href="/recipes/new">Add a new recipe!</Button>
                </Col>
              </Row>
            )}
            <Row>
              {this.state.isLoaded ? (
                this.state.recipes.map((recipe, index) => (
                  <Col xs={12} className="my-4" key={index}>
                    <Card className="h-100">
                      <Card.Header>{recipe.name}</Card.Header>
                      <Card.Body>
                        <Card.Title>
                          {recipe.description === '' ? <br /> : recipe.description}
                        </Card.Title>
                        <Card.Text>
                          Ingredients: {recipe.ingredients.map((i) => i.itemName).join(', ')}
                        </Card.Text>
                        <Button variant="primary" onClick={() => this.showModal(recipe)}>
                          View Recipe
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                ))
              ) : (
                <Row className="w-100 justify-content-center">
                  <Col className="m-5 text-center">
                    <Spinner animation="border" className="orange-spinner" size="lg" />
                  </Col>
                </Row>
              )}
            </Row>
          </Col>
        </Row>
      </Container>
    );
  }
}
export default Search;
