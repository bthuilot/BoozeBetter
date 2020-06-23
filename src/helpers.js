const { validationResult } = require('express-validator');

function checkValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  } else {
    next();
  }
}

function restricted(req, res, next) {
  if (!req.userID) {
    res
      .status(403)
      .json({
        errors: [{ msg: 'You must be logged to perform this action' }],
        needsAuthentication: true,
      });
    return;
  } else {
    next();
  }
}

module.exports = { checkValidation, restricted };
