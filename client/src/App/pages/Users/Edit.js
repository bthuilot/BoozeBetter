import React, { Component } from "react";
import { Container, Row, Col, Form, Button, Spinner } from "react-bootstrap";
import { Redirect, Link } from "react-router-dom";
import { Header } from "../../hooks/Header/Header";
import Cookies from "js-cookie";
import { AlertDisplay } from "../../hooks/AlertDisplay/AlertDisplay";
import { formatErrors } from "../../helpers";
import { ConfirmModal } from "../../hooks/ConfirmModal/ConfirmModal";
import { RequiresSignin } from "../../hooks/RequiresSignin/RequiresSignin";

class EditAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: [],
      updated: false,
      deleted: false,
      showDelete: false,
      updatePassword: false,
      authenticated: Cookies.get("AuthToken"),
      updatedUser: {},
      account: {},
    };

    this.updateUser = this.updateUser.bind(this);
    this.delete = this.delete.bind(this);
  }

  componentDidMount() {
    if (this.props.location.state) {
      const successes = this.props.location.state.successes;
      this.setState({ successes });
    }
    this.fetchAccount();
  }

  delete() {
    // Simple POST request with a JSON body using fetch
    const requestOptions = {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: this.state.user.password }),
      credentials: "include",
    };
    fetch("/account", requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if (res.errors) {
          this.setState({ errors: res.errors.map(formatErrors) });
          return;
        }
        this.setState({ authenticated: false, deleted: true });
      })
      .catch(() => {
        this.setState({
          errors: [
            {
              msg:
                "Error occurred while trying to delete the account. Reload the page and try again",
            },
          ],
        });
      });
  }

  fetchAccount() {
    fetch("/account/details", {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((result) => {
        if (!result.errors) {
          this.setState({
            isLoaded: true,
            account: result.account,
            updatedUser: result.account,
          });
        } else {
          let auth = true;
          if (result.needsAuthentication) {
            auth = false;
          }
          this.setState({
            errors: result.errors.map(formatErrors),
            authenticated: auth,
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

  updateUser(event) {
    this.setState({ errors: [] });
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user: this.state.updatedUser,
        updatePassword: this.state.updatePassword,
      }),
      credentials: "include",
    };

    fetch("/account/update", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (!result.errors) {
          this.setState({ updated: true });
        } else {
          this.setState({
            errors: result.errors.map(formatErrors),
          });
        }
      })
      .catch((err) => {
        console.log(err);
        this.setState({
          errors: [{ msg: "An unknown error occured" }],
        });
      });
    event.preventDefault();
  }

  assignToUser(event, property) {
    const user = this.state.updatedUser;
    user[property] = event.target.value;
    this.setState({ user });
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

  renderEditForm() {
    return (
      <>
        <Row className="justify-content-center align-self-center mx-0 w-100">
          <Col xs={12} md={8}>
            <AlertDisplay errors={this.state.errors}></AlertDisplay>
          </Col>
          <Col xs={12} className="text-center">
            <h1>Update user</h1>
          </Col>
          <Col xs={12} md={8}>
            <Form onSubmit={this.updateUser}>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  onChange={(e) => this.assignToUser(e, "email")}
                  defaultValue={this.state.account.email}
                />
              </Form.Group>

              <Form.Group controlId="formBasicEmail">
                <Form.Label>Display name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter name"
                  onChange={(e) => this.assignToUser(e, "displayName")}
                  defaultValue={this.state.account.display_name}
                />
              </Form.Group>
              <Form.Group controlId="formBasicCheckbox">
                <Form.Check
                  type="checkbox"
                  label={"Update password?"}
                  onChange={(event) => {
                    const update = this.state.updatePassword;
                    this.setState({
                      updatePassword: !update,
                    });
                  }}
                />
              </Form.Group>

              {this.state.updatePassword && (
                <>
                  <Form.Group controlId="formBasicConfirmPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      required="required"
                      type="password"
                      placeholder="Password"
                      onChange={(e) => this.assignToUser(e, "updatedPassword")}
                    />
                  </Form.Group>

                  <Form.Group controlId="formBasicConfirmPassword">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                      required="required"
                      type="password"
                      placeholder="Confirm Password"
                      onChange={(e) => this.assignToUser(e, "confirmPassword")}
                    />
                  </Form.Group>
                </>
              )}

              <Col xs={12}>
                <hr className="my-4" />
              </Col>
              <Form.Group controlId="formBasicPassword">
                <Form.Label>Re-enter Password to Continue</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  onChange={(e) => this.assignToUser(e, "password")}
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="mx-2">
                Update
              </Button>
              <Button
                variant="danger"
                className="mx-2"
                onClick={() => this.setState({ showDelete: true })}
              >
                Delete User
              </Button>
            </Form>
          </Col>
        </Row>
        <ConfirmModal
          text="Are you sure you want to delete this account? (Recipes you created will still be visible to other users)"
          title="Confirm Delete"
          show={this.state.showDelete}
          callback={() => this.delete()}
        />
      </>
    );
  }

  render() {
    if (this.state.deleted) {
      this.setState({ deleted: false });
      return this.redirectTo("Account deleted", "/register");
    }

    if (this.state.updated) {
      this.setState({ updated: false });
      return this.redirectTo("Account updated", "/account");
    }

    if (!this.state.authenticated) {
      return (
        <Container fluid className="d-flex h-100 w-100">
          <Header fixed="top" showsearch variant="dark" bg="dark" />
          <RequiresSignin />
        </Container>
      );
    }

    return (
      <Container fluid className="d-flex h-100 w-100">
        <Header fixed="top" showsearch variant="dark" bg="dark" />
        {this.state.isLoaded ? this.renderEditForm() : this.renderSpinner()}
      </Container>
    );
  }
}

export default EditAccount;
