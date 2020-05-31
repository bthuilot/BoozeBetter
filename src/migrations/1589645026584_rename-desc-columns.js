/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.renameColumn('recipes', 'desc', 'description');
  pgm.renameColumn('instructions', 'desc', 'description');
};
