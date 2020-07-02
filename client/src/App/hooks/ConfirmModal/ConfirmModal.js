import React, { useState, useEffect } from 'react';
import { Row, Col, Modal, Button } from 'react-bootstrap';

export function ConfirmModal(props) {
  const [show, setShow] = useState(props.show);
  const [text, setText] = useState(props.text);
  const [title, setTitle] = useState(props.title);
  const handleClose = () => setShow(false);

  useEffect(() => {
    setShow(props.show);
    setText(props.text);
    setTitle(props.title);
  }, [props]);

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>{title && <Modal.Title>{title}</Modal.Title>}</Modal.Header>
        <Modal.Body>
          <Row className="my-1">
            <Col>
              <p className="lead">{text}</p>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={props.callback}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
