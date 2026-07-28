CREATE OR REPLACE FUNCTION public.notify_inquiry_webhook()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public', 'extensions'
AS $function$
DECLARE
  req_id bigint;
BEGIN
  SELECT net.http_post(
    url := 'https://jnrmabel.app.n8n.cloud/webhook/31fb2057-50ab-47af-9068-7030df22258e',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := jsonb_build_object(
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
  ) INTO req_id;
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'notify_inquiry_webhook failed: %', SQLERRM;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE TRIGGER notify_inquiry_webhook_on_insert
AFTER INSERT ON public.inquiries
FOR EACH ROW
EXECUTE FUNCTION public.notify_inquiry_webhook();