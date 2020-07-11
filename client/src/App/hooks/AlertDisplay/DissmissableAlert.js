import React, { useState } from 'react';
import { Alert } from 'react-bootstrap';

export default function DissmissableAlert(props) {
  const [show, setShow] = useState(true);

  console.log(props);
  if (show) {
    return (
      <Alert variant={props.variant} onClose={() => setShow(false)} dismissible>
        {props.heading && <Alert.Heading>{props.heading}</Alert.Heading>}
        <p>{props.text}</p>
      </Alert>
    );
  }
  return <></>;
}
