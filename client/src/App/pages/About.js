import React, { Component } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Header } from "../hooks/Header/Header";
import GitHubButton from "react-github-btn";

class About extends Component {
  render() {
    return (
      <Container fluid className="p-0">
        <Header variant="dark" bg="dark" sticky="top" search={true} />
        <Row className="my-4">
          <Col>
            <h1 className="text-center">Hey There!</h1>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col className="text-center">
            <p className="text-center text-justify">
              This website was built just for fun but if you have any feedback
              feel free to create a pull request on Github!
            </p>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col xs={4} className="text-center">
            <GitHubButton
              href="https://github.com/bthuilot"
              aria-label="Follow @bthuilot on GitHub"
            >
              Follow @bthuilot
            </GitHubButton>{" "}
          </Col>
          <Col xs={4} className="text-center">
            <GitHubButton
              href="https://github.com/bthuilot/BoozeBetter"
              data-icon="octicon-star"
              aria-label="Star bthuilot/BoozeBetter on GitHub"
            >
              Star
            </GitHubButton>
          </Col>
        </Row>
      </Container>
    );
  }
}
export default About;
