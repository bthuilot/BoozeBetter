import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { Alert, Row, Col, Modal, Button } from "react-bootstrap";

export function RecipeModal(props) {
  const [show, setShow] = useState(props.show);
  const [recipe, setRecipe] = useState(props.recipe);
  const handleClose = () => setShow(false);

  useEffect(() => {
    setShow(props.show);
    setRecipe(props.recipe);
  }, [props]);

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{recipe.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="my-1">
            <Col>
              <p className="lead">{recipe.description}</p>
            </Col>
          </Row>
          <Row className="my-1">
            <Col>
              <h5>Ingredients:</h5>
              <ul>
                {recipe.ingredients.map((i) => {
                  return (
                    <li>
                      {i.quantity} {i.unit} of {i.itemName}
                    </li>
                  );
                })}
              </ul>
            </Col>
          </Row>
          <Row className="my-1">
            <Col>
              <h5>Instructions</h5>
              <ol>
                {recipe.instructions.map((i) => {
                  return (
                    <li>
                      {i.quantity} {i.unit} of {i.itemName}
                    </li>
                  );
                })}
              </ol>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            View recipe page
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
