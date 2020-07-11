import React, { useState, useEffect } from 'react';
import DissmissableAlert from './DissmissableAlert';

export default function AlertDisplay(props) {
  const { errorsProps, successesProps, warningsProps } = props;
  const [errors, setErrors] = useState(errorsProps);
  const [successes, setSuccesses] = useState(successesProps);
  const [warnings, setWarnings] = useState(warningsProps);

  useEffect(() => {
    setErrors(props.errors);
    setWarnings(props.warnings);
    setSuccesses(props.successes);
  }, [props]);

  return (
    <>
      {errors &&
        errors.map((error, index) => (
          <DissmissableAlert key={index} variant="danger" text={error} />
        ))}
      {warnings &&
        warnings.map((warning, index) => (
          <DissmissableAlert key={index} variant="warning" text={warning} />
        ))}
      {successes &&
        successes.map((success, index) => (
          <DissmissableAlert key={index} variant="success" text={success} />
        ))}
    </>
  );
}
