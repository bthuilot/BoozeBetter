/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  // Create recipes table
  pgm.createTable('recipes', {
    id: 'id',
    name: {
      type: 'varchar(255)',
      notNull: true,
    },
    createdAt: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    desc: {
      type: 'text',
    },
  });

  // Create the ingredients tabl
  pgm.createTable('ingredients', {
    id: 'id',
    item_name: {
      type: 'varchar(255)',
      notNull: true,
    },
    quantity: {
      type: 'varchar(20)',
      notNull: true,
    },
    unit: {
      type: 'varchar(255)',
      notNull: true,
    },
    recipe_id: {
      type: 'integer',
      notNull: true,
      references: '"recipes"',
      onDelete: 'cascade',
    },
  });
  pgm.createIndex('ingredients', 'recipe_id');

  // Create instructions table
  pgm.createTable('instructions', {
    id: 'id',
    desc: {
      type: 'varchar(255)',
      notNull: true,
    },
    order: {
      type: 'smallint',
      notNull: true,
    },
    recipe_id: {
      type: 'integer',
      notNull: true,
      references: '"recipes"',
      onDelete: 'cascade',
    },
  });
  pgm.createIndex('instructions', 'recipe_id');
};
