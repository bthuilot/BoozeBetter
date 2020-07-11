import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

export function NoMatch({ location }) {
  return (
    <Container className="d-flex h-100 w-100">
      <Row className="align-self-center mx-0 w-100">
        <Col>
          <Row className="mb-3">
            <Col className="justify-content-center text-center">
              <h1 className="text-center">
                No match for <code>{location.pathname}</code>
              </h1>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}
