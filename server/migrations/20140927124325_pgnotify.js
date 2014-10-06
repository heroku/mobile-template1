'use strict';

exports.up = function(knex, Promise) {
  return Promise.all([
    knex.raw('CREATE FUNCTION questions_notify_trigger() RETURNS trigger AS $$ \
				    DECLARE \
				     BEGIN \
				       PERFORM pg_notify(\'questions\',to_char(NEW.id, \'999\')); \
				       RETURN new; \
				     END; \
				    $$ LANGUAGE plpgsql; \
				    CREATE TRIGGER questions_show_trigger AFTER UPDATE ON questions \
				    FOR EACH ROW EXECUTE PROCEDURE questions_notify_trigger(); \
				  ')
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.raw("DROP TRIGGER questions_show_trigger on questions"),
    knex.raw("DROP FUNCTION questions_notify_trigger()")
  ]);
};