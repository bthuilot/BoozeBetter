import React, { Component } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { Redirect, Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Header } from '../../hooks/Header/Header';
import AlertDisplay from '../../hooks/AlertDisplay/AlertDisplay';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: [],
      user: {},
    };

    this.login = this.login.bind(this);
    this.updateEmail = this.updateEmail.bind(this);
    this.updatePassword = this.updatePassword.bind(this);
  }

  updateEmail(event) {
    const { user } = this.state;
    user.email = event.target.value;
    this.setState({ user });
  }

  updatePassword(event) {
    const { user } = this.state;
    user.password = event.target.value;
    this.setState({ user });
  }

  login(event) {
    // Simple POST request with a JSON body using fetch
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(this.state.user),
      credentials: 'include',
    };

    fetch('/login', requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (!result.errors) {
          this.setState({ success: true });
        } else {
          this.setState({
            errors: [
              'Login failed. Please check your username and password combination is correct',
            ],
          });
        }
      })
      .catch((err) => {
        this.setState({
          errors: ['An unknown error occured please try again'],
        });
      });
    event.preventDefault();
  }

  redirectToAccount(msg) {
    return (
      <Redirect
        push
        to={{
          pathname: '/account',
          state: { successes: [msg] },
        }}
      />
    );
  }

  errorMessage(msg) {}

  render() {
    if (this.state.success) {
      return this.redirectToAccount('Login Successful');
    }

    if (this.state.authToken) {
      return this.redirectToAccount('Already logged in');
    }

    return (
      <Container fluid className="d-flex h-100 w-100">
        <Header fixed="top" showsearch variant="dark" bg="dark" />
        <Row className="justify-content-center align-self-center mx-0 w-100">
          <Col xs={12} md={8}>
            <AlertDisplay errors={this.state.errors} />
          </Col>
          <Col xs={12} className="text-center">
            <h1>Login</h1>
            <p>
              ...or signup <Link to="/register">here</Link>
            </p>
          </Col>
          <Col xs={12} md={6}>
            <Form onSubmit={this.login}>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder="Enter email" onChange={this.updateEmail} />
              </Form.Group>

              <Form.Group controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  onChange={this.updatePassword}
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

export default Login;
