CREATE OR REPLACE FUNCTION public.owns_record_as_user(IN user_id uuid, OUT success boolean)
    RETURNS boolean
    LANGUAGE plpgsql
    STABLE
    SET search_path TO 'pg_catalog', 'public', 'pg_temp'
    AS
$BODY$
BEGIN
    success := EXISTS (
        SELECT 1
        FROM public.users
        WHERE auth_user_id = auth.uid()
        AND id = user_id
    );
END
$BODY$
;



