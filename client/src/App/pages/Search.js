import React, { Component } from "react";
import { Row, Card, Col, Button } from "react-bootstrap";
import { parse } from "query-string";

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      recipes: [],
    };
  }

  componentDidMount() {
    var parsed = parse(this.props.location.search);
    fetch("/recipes?q=" + parsed.q)
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
  }

  render() {
    return (
      <Row>
        <Col>
          {this.state.recipes.map((recipe) => (
            <Row>
              <Card>
                <Card.Body>
                  <Card.Title>{recipe.name}</Card.Title>
                  <Card.Text>{recipe.description}</Card.Text>
                  <Button variant="primary">View Recipe</Button>
                </Card.Body>
              </Card>
            </Row>
          ))}
        </Col>
      </Row>
    );
  }
}
export default Search;
