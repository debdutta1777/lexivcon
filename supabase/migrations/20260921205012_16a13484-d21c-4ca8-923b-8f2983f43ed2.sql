CREATE TABLE public.legal_cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  document_name TEXT,
  document_type TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.legal_cases TO authenticated;
GRANT ALL ON public.legal_cases TO service_role;
ALTER TABLE public.legal_cases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own legal cases" ON public.legal_cases FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.legal_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES public.legal_cases(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.legal_messages TO authenticated;
GRANT ALL ON public.legal_messages TO service_role;
ALTER TABLE public.legal_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage messages in their own legal cases" ON public.legal_messages FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.update_legal_case_timestamp()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
CREATE TRIGGER update_legal_cases_updated_at BEFORE UPDATE ON public.legal_cases FOR EACH ROW EXECUTE FUNCTION public.update_legal_case_timestamp();
CREATE INDEX legal_cases_user_updated_idx ON public.legal_cases(user_id, updated_at DESC);
CREATE INDEX legal_messages_case_created_idx ON public.legal_messages(case_id, created_at ASC);