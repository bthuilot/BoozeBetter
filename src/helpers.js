const { validationResult } = require('express-validator');
const NotFoundError = require('./types/errors/notFound');
const NotAuthenticatedError = require('./types/errors/notAuthenticated');
const ForbiddenError = require('./types/errors/forbidden');

function checkValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
  } else {
    next();
  }
}

function restricted(req, res, next) {
  if (!req.userID) {
    res.status(403).json({
      errors: [{ msg: 'You must be logged to perform this action' }],
      needsAuthentication: true,
    });
  } else {
    next();
  }
}

function createError(message) {
  return { errors: [{ msg: message }] };
}

function handleErrors(err, res) {
  switch (true) {
    case err instanceof NotAuthenticatedError:
      res.status(401).json(createError(`Unable to authenticated: ${err.message}`));
      break;
    case err instanceof NotFoundError:
      res.status(404).json(createError(`Not found: ${err.message}`));
      break;
    case err instanceof ForbiddenError:
      res.status(403).json(createError(`Forbidden: ${err.message}`));
      break;
    default:
      res.status(500).json(createError(`An unknown error occurred: ${err.message}`));
  }
}

module.exports = { checkValidation, restricted, handleErrors };
