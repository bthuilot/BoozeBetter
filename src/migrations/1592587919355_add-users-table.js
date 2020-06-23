/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('users', {
    id: 'id',
    email: { type: 'varchar(1000)', notNull: true, unique: true },
    createdAt: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    password_hash: { type: 'varchar(1000)', notNull: true },
    password_salt: { type: 'varchar(8)', notNull: true },
    display_name: { type: 'varchar(1000)' },
  });

  pgm.addColumn('recipes', {
    user_id: { type: 'integer', references: '"users"', onDelete: 'set null' },
  });
  pgm.createIndex('recipes', 'user_id');
  pgm.createIndex('users', 'email');
};

exports.down = (pgm) => {};
