import React, { Component } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { Redirect, Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Header } from '../../hooks/Header/Header';
import AlertDisplay from '../../hooks/AlertDisplay/AlertDisplay';
import { formatErrors } from '../../helpers';

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: [],
      success: false,
      authToken: Cookies.get('AuthToken'),
      user: {},
      legalToDrink: false,
      acceptTerms: false,
    };

    this.registerUser = this.registerUser.bind(this);
    this.assignToUser = this.assignToUser.bind(this);
  }

  registerUser(event) {
    this.setState({ errors: [] });
    const { user } = this.state;
    const { acceptTerms, legalToDrink } = this.state;
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user, legalToDrink, acceptTerms }),
      credentials: 'include',
    };

    fetch('/register', requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (!result.errors) {
          this.setState({ success: true });
        } else {
          this.setState({
            errors: result.errors.map(formatErrors),
          });
        }
      })
      .catch(() => {
        this.setState({
          errors: ['An unknown error occured'],
        });
      });
    event.preventDefault();
  }

  assignToUser(event, property) {
    const { user } = this.state;
    user[property] = event.target.value;
    this.setState({ user });
  }

  render() {
    if (this.state.authToken) {
      return redirectToAccount('Already logged in');
    }

    if (this.state.success) {
      return redirectToAccount('Login Successful');
    }

    return (
      <Container fluid className="d-flex h-100 w-100">
        <Header fixed="top" showsearch variant="dark" bg="dark" />
        <Row className="justify-content-center align-self-center mx-0 w-100">
          <Col xs={12} md={8}>
            <AlertDisplay errors={this.state.errors} />
          </Col>
          <Col xs={12} className="text-center">
            <h1>Register</h1>
            <p>
              ...or login <Link to="/login">here</Link>
            </p>
          </Col>
          <Col xs={12} md={8}>
            <Form onSubmit={this.registerUser}>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  onChange={(e) => this.assignToUser(e, 'email')}
                />
              </Form.Group>

              <Form.Group controlId="formBasicEmail">
                <Form.Label>Dispaly name (optional)</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter name"
                  onChange={(e) => this.assignToUser(e, 'displayName')}
                />
              </Form.Group>

              <Form.Group controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  onChange={(e) => this.assignToUser(e, 'password')}
                />
              </Form.Group>

              <Form.Group controlId="formBasicConfirmPassword">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Confirm Password"
                  onChange={(e) => this.assignToUser(e, 'confirmPassword')}
                />
              </Form.Group>

              <Form.Group controlId="formBasicCheckbox">
                <Form.Check
                  type="checkbox"
                  label={renderLegalLinks()}
                  onChange={(e) => {
                    const { acceptTerms } = this.state;
                    this.setState({ acceptTerms: !acceptTerms });
                  }}
                />
                <Form.Check
                  type="checkbox"
                  label="I am above legal drinking age in my respective country"
                  onChange={(e) => {
                    const { legalToDrink } = this.state;
                    this.setState({ legalToDrink: !legalToDrink });
                  }}
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    );
  }
}

function redirectToAccount(msg) {
  return (
    <Redirect
      to={{
        pathname: '/account',
        state: { successes: [msg] },
      }}
    />
  );
}

function renderLegalLinks() {
  return (
    <p>
      I agree to the
      <a href="/terms-and-conditions.pdf"> terms and conditions </a>
      and
      <a href="/privacy-policy.pdf"> privacy policy</a>
    </p>
  );
}
export default Register;
