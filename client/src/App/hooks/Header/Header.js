import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Row, Col } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import Cookies from 'js-cookie';
import './Header.css';
import { SearchBar } from '../SearchBar/SearchBar';

export function Header(props) {
  const history = useHistory();
  const [searchOpen, setSearchOpen] = useState(false);
  const loggedIn = Cookies.get('AuthToken');
  const { showsearch, ...otherProps } = props;

  useEffect(() => {
    history.listen(() => {
      setSearchOpen(false);
    });
  });

  return (
    <>
      <div id="searchOverlay" style={{ zIndex: 2000, width: searchOpen ? '100%' : '0%' }}>
        <Row className="justify-content-right my-2">
          <Col className="text-right" xs={12} md={10}>
            <a
              className="closebtn"
              style={{ cursor: 'pointer' }}
              onClick={() => setSearchOpen(false)}
            >
              ❌
            </a>
          </Col>
        </Row>
        <Row className="my-2 justify-content-center">
          <Col xs={10} md={6}>
            <SearchBar whiteText />
          </Col>
        </Row>
      </div>
      <Navbar collapseOnSelect expand="lg" {...otherProps}>
        <Navbar.Brand href="/">
          <span role="img" style={{ fontSize: '1.25em' }} aria-label="booze">
            🍻
          </span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="/about">About</Nav.Link>
            {loggedIn && <Nav.Link href="/recipes/new">Add Recipe</Nav.Link>}
          </Nav>
          <Nav>
            {' '}
            {showsearch && (
              <Nav.Link>
                <span
                  role="img"
                  className="text-center"
                  style={{ fontSize: '1em' }}
                  aria-label="booze"
                  onClick={() => setSearchOpen(true)}
                >
                  🔎
                </span>
              </Nav.Link>
            )}
            {loggedIn ? (
              <Nav.Link href="/account">My Account</Nav.Link>
            ) : (
              <>
                <Nav.Link href="/login">Login</Nav.Link>
                <Nav.Link href="/register">Sign up</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </>
  );
}
