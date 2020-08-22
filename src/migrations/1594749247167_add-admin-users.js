/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumn('users', {
    is_admin: { type: 'boolean', default: false },
  });
};
