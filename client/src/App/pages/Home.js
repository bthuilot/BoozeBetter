import React, { Component } from "react";
import { Row, Col, Container } from "react-bootstrap";
import { SearchBar } from "../hooks/SearchBar/SearchBar";
import { Header } from "../hooks/Header/Header";

class Home extends Component {
  render() {
    return (
      <Container className="d-flex h-100 w-100">
        <Header fixed="top" showsearch={false} />
        <Row className="align-self-center mx-0 w-100">
          <Col>
            <Row className="mb-3">
              <Col className="justify-content-center text-center">
                <h1 className="text-center">
                  Booze Better!
                  <br />
                  <span role="img" aria-label="cheers">
                    🍻
                  </span>
                </h1>
              </Col>
            </Row>
            <Row className="align-self-center mx-0 w-100">
              <SearchBar />
            </Row>
          </Col>
        </Row>
      </Container>
    );
  }
}
export default Home;
