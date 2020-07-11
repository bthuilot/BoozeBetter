import React, { Component } from 'react';
import {
  Container,
  Row,
  Col,
  Spinner,
  InputGroup,
  ListGroup,
  FormControl,
  Button,
} from 'react-bootstrap';
import Cookies from 'js-cookie';
import AlertDisplay from '../../hooks/AlertDisplay/AlertDisplay';
import { Header } from '../../hooks/Header/Header';
import { RequiresSignin } from '../../hooks/RequiresSignin/RequiresSignin';
import { formatErrors } from '../../helpers';

class Account extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: [],
      successes: [],
      isLoaded: false,
      account: {},
      authenticated: Cookies.get('AuthToken'),
    };

    this.fetchAccount = this.fetchAccount.bind(this);
    this.signout = this.signout.bind(this);
  }

  componentDidMount() {
    if (this.props.location.state) {
      const { successes } = this.props.location.state;
      this.setState({ successes });
    }
    this.fetchAccount();
  }

  signout() {
    fetch('/signout', { method: 'PUT' })
      .then(() => {
        this.setState({ authenticated: false });
      })
      .catch(() => {
        this.setState({
          errors: [
            {
              msg: 'Error occurred while trying to sign out. Reload the page and try again',
            },
          ],
        });
      });
  }

  fetchAccount() {
    fetch('/account/details', {
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((result) => {
        if (!result.errors) {
          this.setState({ isLoaded: true, account: result.account });
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
          errors: ['An unknown error occured'],
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

  renderAccountDetails() {
    const name = this.state.account.display_name;
    return (
      <>
        <Col xs={12} md={8} className="text-center my-3">
          <h1>
Cheers{name && ` ${name}`}
!
</h1>
        </Col>
        <Col xs={12} md={6} className="my-3 text-center justify-content-center">
          <InputGroup className="mb-3">
            <InputGroup.Prepend>
              <InputGroup.Text>Email</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              aria-describedby="basic-addon1"
              defaultValue={this.state.account.email}
              disabled
            />
          </InputGroup>
        </Col>
        <Col xs={12} />
        <Col xs={4} md={2} className="text-center">
          <Button className="mx-1" href="/account/edit">
            Edit Account
          </Button>
        </Col>
        <Col xs={4} md={2} className="text-center">
          <Button variant="secondary" className="mx-1" onClick={this.signout}>
            Sign out
          </Button>
        </Col>
        <Col xs={12} />
        <Col xs={4}>
          <hr className="mt-2 mb-3" />
        </Col>
        <Col xs={12} />
        <Col xs={12} className="text-center">
          <h3>Cocktails</h3>
        </Col>
        <Col xs={12} md={8} className="my-2 text-center">
          {this.state.account.recipes.length === 0 && <small>No recipes found :(</small>}
          <ListGroup>
            {this.state.account.recipes.map((recipe, index) => {
              return (
                <ListGroup.Item key={index} action href={`/recipes/${recipe.id}`}>
                  {recipe.name}
                </ListGroup.Item>
              );
            })}
          </ListGroup>
        </Col>
      </>
    );
  }

  renderAccount() {
    return <>{this.state.isLoaded ? this.renderAccountDetails() : this.renderSpinner()}</>;
  }

  render() {
    return (
      <Container fluid className={this.state.authenticated ? 'p-0' : 'd-flex w-100 h-100'}>
        <Header
          variant="dark"
          bg="dark"
          fixed={!this.state.authenticated && 'top'}
          stick={this.state.authenticated && 'top'}
          showsearch
        />
        {this.state.authenticated ? (
          <>
            <Row className="justify-content-center align-self-center mx-0 my-2 w-100">
              <Col xs={12}>
                <AlertDisplay errors={this.state.errors} successes={this.state.successes} />
              </Col>
              {this.renderAccount()}
            </Row>
          </>
        ) : (
          <RequiresSignin removeToken={this.state.authenticated == false} />
        )}
      </Container>
    );
  }
}
export default Account;
