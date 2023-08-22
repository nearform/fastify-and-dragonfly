CREATE FUNCTION notify_registration_status_updated()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $function$
BEGIN
  PERFORM pg_notify('users_registration_status_updated', row_to_json(NEW)::text);
  RETURN NULL;
END
$function$;

CREATE TRIGGER tr_users_registration_status_trigger AFTER INSERT OR UPDATE OF status ON users
FOR EACH ROW EXECUTE PROCEDURE notify_registration_status_updated();