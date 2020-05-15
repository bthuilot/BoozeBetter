import React, { Component } from "react";
import {
  Alert,
  Row,
  Col,
  InputGroup,
  FormControl,
  Button,
} from "react-bootstrap";
import SearchBar from "../components/SearchBar";

class Home extends Component {
  render() {
    return (
      <Row className="align-self-center mx-0 w-100">
        <Col>
          <Row className="mb-3">
            <Col className="justify-content-center text-center">
              <h1 className="text-center">Cocktail Finder</h1>
            </Col>
          </Row>
          <Row className="align-self-center mx-0 w-100">
            <SearchBar />
          </Row>
        </Col>
      </Row>
    );
  }
}
export default Home;
