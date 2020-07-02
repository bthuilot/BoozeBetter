const { check, body } = require('express-validator');
const { checkValidation, restricted, handleErrors } = require('../helpers');

class UsersController {
  constructor(manager, authManager) {
    this.manager = manager;
    this.authManager = authManager;
  }

  registerRoutes(app) {
    app.put('/signout', this.authManager.removeCookie, (req, res) => {
      res.redirect('/login');
    });

    app.delete(
      '/account',
      [
        check(
          'password',
          'Password must be at least 8 characters and contain at least 1 digit, lowercase and upperCase letter'
        )
          .optional()
          .isString()
          .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, 'i'),
      ],
      checkValidation,
      restricted,
      (req, res, next) => {
        this.manager
          .deleteUser(req.userID, req.body.password)
          .then(() => next())
          .catch((err) => {
            handleErrors(err, res);
          });
      },
      this.authManager.removeCookie,
      (req, res) => {
        res.json({ successes: [{ msg: 'User deleted' }] });
      }
    );

    app.post(
      '/account/update',
      restricted,
      [
        check('updatePassword').isBoolean(),
        check('user.displayName').optional().isString(),
        check('user.email', 'Please enter a valid email').isEmail(),
        check(
          'user.updatedPassword',
          'Password must be at least 8 characters and contain at least 1 digit, lowercase and upperCase letter'
        )
          .optional()
          .isString()
          .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, 'i'),
        body('user.confirmPassword', 'Passwords do not match').custom((value, { req }) => {
          if (req.body.updatedPassowrd && value !== req.body.updatedPassword) {
            throw new Error('Passwords do not match');
          }
          return true;
        }),
      ],
      checkValidation,
      (req, res) => {
        const { user, updatePassword } = req.body;
        this.manager
          .updateUser(req.userID, user, updatePassword)
          .then((id) => {
            res.json({ successes: [{ msg: 'Successfully updated user' }] });
          })
          .catch((err) => {
            handleErrors(err, res);
          });
      }
    );

    app.post(
      '/register',
      [
        check('user.email', 'Please enter a valid email').isEmail(),
        check(
          'user.password',
          'Password must be at least 8 characters and contain at least 1 digit, lowercase and uppercase letter'
        )
          .isString()
          .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, 'i'),
        check('acceptTerms').isBoolean(),
        check('legalToDrink').isBoolean(),
        check('user.displayName').optional().isString(),
        body('user.confirmPassword', 'Passwords do not match').custom((value, { req }) => {
          if (value !== req.body.user.password) {
            throw new Error('Passwords do not match');
          }
          return true;
        }),
      ],
      checkValidation,
      (req, res) => {
        const { user, acceptTerms, legalToDrink } = req.body;
        if (!acceptTerms || !legalToDrink) {
          res.status(400).json({ errors: [{ msg: 'You must accept terms to create a user' }] });
          return;
        }

        const { email, password, displayName } = user;
        this.manager.emailExists(email).then((emailExists) => {
          if (!emailExists) {
            this.manager
              .createNewUser({
                email,
                password,
                displayName,
              })
              .then((result) => {
                this.authManager.createToken(result, res);
                res.json({ id: result });
              })
              .catch((err) => {
                handleErrors(err, res);
              });
          } else {
            res
              .status(500)
              .json({ errors: [{ msg: 'An unknown error occurred while creating user' }] });
          }
        });
      }
    );

    app.post(
      '/login',
      [
        check('email', 'Please enter a valid email').isEmail(),
        check('password', 'The username or password was incorrect')
          .isString()
          .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, 'i'),
      ],
      checkValidation,
      (req, res) => {
        const { email, password } = req.body;
        if (req.userID) {
          res.json({ id: req.userID });
          return;
        }
        this.manager
          .login(email, password)
          .then((userID) => {
            this.authManager.createToken(userID, res);
            res.json({ id: userID });
          })
          .catch((err) => {
            handleErrors(err, res);
          });
      }
    );

    app.get('/account/details', restricted, (req, res) => {
      this.manager
        .getAccountDetails(req.userID)
        .then((result) => {
          res.json({ account: result });
        })
        .catch((err) => {
          handleErrors(err, res);
        });
    });
  }
}

module.exports = UsersController;
