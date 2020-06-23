import React, { useState, useEffect } from "react";
import { DissmissableAlert } from "./DissmissableAlert";

export function AlertDisplay(props) {
  const [errors, setErrors] = useState(props.errors);
  const [successes, setSuccesses] = useState(props.successes);
  const [warnings, setWarnings] = useState(props.warnings);

  useEffect(() => {
    setErrors(props.errors);
    setWarnings(props.warnings);
    setSuccesses(props.successes);
  }, [props]);

  return (
    <>
      {errors &&
        errors.map((error, index) => (
          <DissmissableAlert
            key={index}
            variant="danger"
            text={error}
          ></DissmissableAlert>
        ))}
      {warnings &&
        warnings.map((warning, index) => (
          <DissmissableAlert
            key={index}
            variant="warning"
            text={warning}
          ></DissmissableAlert>
        ))}
      {successes &&
        successes.map((success, index) => (
          <DissmissableAlert
            key={index}
            variant="success"
            text={success}
          ></DissmissableAlert>
        ))}
    </>
  );
}
