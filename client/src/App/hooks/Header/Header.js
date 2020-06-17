import React, { useState, useEffect } from "react";
import { Navbar, Nav, Form, FormControl, Button } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import "./Header.css";

export function Header(props) {
  const [reload, setReload] = useState(false);
  const [query, setQuery] = useState("");
  const { search, ...otherProps } = props;

  useEffect(() => {
    setReload(false);
    setQuery("");
  }, [reload, props.showsearch]);

  if (reload) {
    return <Redirect push to={"/search?q=" + encodeURI(query)} />;
  }

  return (
    <Navbar collapseOnSelect expand="lg" {...otherProps}>
      <Navbar.Brand href="/">
        <span role="img" style={{ fontSize: "1.25em" }} aria-label="booze">
          🍻
        </span>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link href="/about">About</Nav.Link>
          <Nav.Link href="/recipe/new">Add Recipe</Nav.Link>
        </Nav>
        {props.showsearch && (
          <Form inline>
            <FormControl
              type="text"
              placeholder="Seperate terms with `,`"
              className="mr-sm-2 my-1"
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  setReload(true);
                }
              }}
            />
            <Button
              variant="outline-info"
              onClick={() => {
                setReload(true);
              }}
              className="orange-outline-info"
            >
              Search
            </Button>
          </Form>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
}
