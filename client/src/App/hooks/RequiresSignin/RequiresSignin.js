import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import Cookies from "js-cookie";

export function RequiresSignin(props) {
  const [removeToken, setRemoveToken] = useState(props.removeToken);

  useEffect(() => {
    setRemoveToken(props.removeToken);
  }, [props]);

  if (removeToken) {
    Cookies.remove("AuthToken");
  }

  return (
    <Row className="align-self-center mx-0 w-100">
      <Col>
        <Row className="mb-3">
          <Col className="justify-content-center text-center">
            <h3 className="text-center">
              You must be signed in to view this page
            </h3>
          </Col>
        </Row>
        <Row className="mb-3 justify-content-center">
          <Col xs={1} className="justify-content-center text-center">
            <Link
              className="text-center"
              to={{
                pathname: "/login",
              }}
            >
              Login
            </Link>
          </Col>
          <Col xs={1} className="justify-content-center text-center">
            <Link
              className="text-center"
              to={{
                pathname: "/register",
              }}
            >
              Register
            </Link>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}
