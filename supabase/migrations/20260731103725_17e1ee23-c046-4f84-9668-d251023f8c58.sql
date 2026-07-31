CREATE OR REPLACE FUNCTION public.notify_inquiry_webhook()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'extensions'
AS $function$
DECLARE
  req_id bigint;
  payload jsonb;
BEGIN
  payload := jsonb_build_object(
    'type', 'INSERT',
    'table', 'inquiries',
    'record', jsonb_build_object(
      'id', NEW.id,
      'created_at', NEW.created_at,
      'full_name', NEW.full_name,
      'email', NEW.email,
      'company_name', NEW.company_name,
      'service_needed', NEW.service_needed,
      'budget_range', NEW.budget_range,
      'project_details', NEW.project_details,
      'status', NEW.status
    )
  );

  SELECT net.http_post(
    url := 'https://jnrmabel.app.n8n.cloud/webhook/31fb2057-50ab-47af-9068-7030df22258e',
    headers := jsonb_build_object('Content-Type', 'application/json'),
    body := payload
  ) INTO req_id;
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'notify_inquiry_webhook failed: %', SQLERRM;
  RETURN NEW;
END;
$function$;

REVOKE EXECUTE ON FUNCTION public.notify_inquiry_webhook() FROM PUBLIC, anon, authenticated;