-- JAN Beat Store: initial schema (tables, RLS, view, storage, seed)

-- Table: admin_users (created without policy first, policy added after is_admin)
CREATE TABLE IF NOT EXISTS public.admin_users (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Helper: is_admin()
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()
  );
$$;

-- Now add the admin_users policy
DROP POLICY IF EXISTS "admin_read_admin_users" ON public.admin_users;
CREATE POLICY "admin_read_admin_users" ON public.admin_users
  FOR SELECT TO authenticated USING (public.is_admin());

-- Table: beats
CREATE TABLE IF NOT EXISTS public.beats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  genre text NOT NULL CHECK (genre IN ('Trap','Reggaetón','R&B')),
  bpm integer NOT NULL CHECK (bpm > 0 AND bpm < 300),
  musical_key text NOT NULL,
  mood text,
  description_es text,
  description_en text,
  cover_path text,
  preview_path text,
  master_path text,
  stems_path text,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published')),
  featured boolean NOT NULL DEFAULT false,
  exclusive_sold boolean NOT NULL DEFAULT false,
  sort_date timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.beats ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_select_beats" ON public.beats;
CREATE POLICY "admin_select_beats" ON public.beats
  FOR SELECT TO authenticated USING (public.is_admin());
DROP POLICY IF EXISTS "admin_insert_beats" ON public.beats;
CREATE POLICY "admin_insert_beats" ON public.beats
  FOR INSERT TO authenticated WITH CHECK (public.is_admin());
DROP POLICY IF EXISTS "admin_update_beats" ON public.beats;
CREATE POLICY "admin_update_beats" ON public.beats
  FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
DROP POLICY IF EXISTS "admin_delete_beats" ON public.beats;
CREATE POLICY "admin_delete_beats" ON public.beats
  FOR DELETE TO authenticated USING (public.is_admin());

-- View: public_beats (hides master_path and stems_path, only published)
CREATE OR REPLACE VIEW public.public_beats AS
SELECT id, title, slug, genre, bpm, musical_key, mood,
  description_es, description_en, cover_path, preview_path,
  status, featured, exclusive_sold, sort_date, created_at
FROM public.beats
WHERE status = 'published';
ALTER VIEW public.public_beats SET (security_invoker = false);
GRANT SELECT ON public.public_beats TO anon, authenticated;

-- Table: licenses
CREATE TABLE IF NOT EXISTS public.licenses (
  id text PRIMARY KEY,
  name_es text NOT NULL,
  name_en text NOT NULL,
  price numeric(10,2) NOT NULL CHECK (price >= 0),
  is_exclusive boolean NOT NULL DEFAULT false,
  sort integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true
);
ALTER TABLE public.licenses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_select_licenses" ON public.licenses;
CREATE POLICY "public_select_licenses" ON public.licenses
  FOR SELECT TO anon, authenticated USING (active = true);
DROP POLICY IF EXISTS "admin_select_licenses" ON public.licenses;
CREATE POLICY "admin_select_licenses" ON public.licenses
  FOR SELECT TO authenticated USING (public.is_admin());
DROP POLICY IF EXISTS "admin_insert_licenses" ON public.licenses;
CREATE POLICY "admin_insert_licenses" ON public.licenses
  FOR INSERT TO authenticated WITH CHECK (public.is_admin());
DROP POLICY IF EXISTS "admin_update_licenses" ON public.licenses;
CREATE POLICY "admin_update_licenses" ON public.licenses
  FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
DROP POLICY IF EXISTS "admin_delete_licenses" ON public.licenses;
CREATE POLICY "admin_delete_licenses" ON public.licenses
  FOR DELETE TO authenticated USING (public.is_admin());

-- Table: beat_license_prices (optional per-beat overrides)
CREATE TABLE IF NOT EXISTS public.beat_license_prices (
  beat_id uuid REFERENCES public.beats(id) ON DELETE CASCADE,
  license_id text REFERENCES public.licenses(id) ON DELETE CASCADE,
  price numeric(10,2) NOT NULL CHECK (price >= 0),
  PRIMARY KEY (beat_id, license_id)
);
ALTER TABLE public.beat_license_prices ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_select_beat_license_prices" ON public.beat_license_prices;
CREATE POLICY "public_select_beat_license_prices" ON public.beat_license_prices
  FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "admin_insert_beat_license_prices" ON public.beat_license_prices;
CREATE POLICY "admin_insert_beat_license_prices" ON public.beat_license_prices
  FOR INSERT TO authenticated WITH CHECK (public.is_admin());
DROP POLICY IF EXISTS "admin_update_beat_license_prices" ON public.beat_license_prices;
CREATE POLICY "admin_update_beat_license_prices" ON public.beat_license_prices
  FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
DROP POLICY IF EXISTS "admin_delete_beat_license_prices" ON public.beat_license_prices;
CREATE POLICY "admin_delete_beat_license_prices" ON public.beat_license_prices
  FOR DELETE TO authenticated USING (public.is_admin());

-- Table: orders
CREATE TABLE IF NOT EXISTS public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text,
  stripe_session_id text UNIQUE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','paid','refunded')),
  total numeric(10,2) NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'eur',
  created_at timestamptz DEFAULT now(),
  paid_at timestamptz
);
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "admin_select_orders" ON public.orders;
CREATE POLICY "admin_select_orders" ON public.orders
  FOR SELECT TO authenticated USING (public.is_admin());

-- Table: order_items
CREATE TABLE IF NOT EXISTS public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  beat_id uuid REFERENCES public.beats(id),
  license_id text REFERENCES public.licenses(id),
  price numeric(10,2) NOT NULL DEFAULT 0
);
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "admin_select_order_items" ON public.order_items;
CREATE POLICY "admin_select_order_items" ON public.order_items
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_items.order_id AND public.is_admin())
  );

-- Table: download_tokens
CREATE TABLE IF NOT EXISTS public.download_tokens (
  token uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_item_id uuid NOT NULL REFERENCES public.order_items(id) ON DELETE CASCADE,
  expires_at timestamptz NOT NULL,
  downloads_count integer NOT NULL DEFAULT 0,
  max_downloads integer NOT NULL DEFAULT 5
);
ALTER TABLE public.download_tokens ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "admin_select_download_tokens" ON public.download_tokens;
CREATE POLICY "admin_select_download_tokens" ON public.download_tokens
  FOR SELECT TO authenticated USING (public.is_admin());

-- Indexes
CREATE INDEX IF NOT EXISTS idx_beats_status ON public.beats(status);
CREATE INDEX IF NOT EXISTS idx_beats_sort_date ON public.beats(sort_date DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON public.order_items(order_id);

-- Seed: licenses
INSERT INTO public.licenses (id, name_es, name_en, price, is_exclusive, sort, active) VALUES
  ('mp3','MP3 LEASE','MP3 LEASE',19.99,false,1,true),
  ('wav','WAV LEASE','WAV LEASE',29.99,false,2,true),
  ('trackout','TRACKOUT LEASE','TRACKOUT LEASE',59.99,false,3,true),
  ('unlimited','UNLIMITED LEASE','UNLIMITED LEASE',99.99,false,4,true),
  ('exclusive','EXCLUSIVE','EXCLUSIVE',249.99,true,5,true)
ON CONFLICT (id) DO UPDATE SET
  name_es=EXCLUDED.name_es, name_en=EXCLUDED.name_en, price=EXCLUDED.price,
  is_exclusive=EXCLUDED.is_exclusive, sort=EXCLUDED.sort, active=EXCLUDED.active;

-- Seed: beats (temporary public paths — re-upload via admin panel later)
INSERT INTO public.beats (id, title, slug, genre, bpm, musical_key, mood, cover_path, preview_path, master_path, status, featured, sort_date)
VALUES
  ('a0000001-0000-0000-0000-000000000001','NOS MATAMOS','nos-matamos','Reggaetón',88,'A# minor','Perreo oscuro',
   '/covers/nos-matamos.jpg','/beats/nos-matamos.mp3','/beats/nos-matamos.mp3','published',true,now() - interval '1 day'),
  ('a0000001-0000-0000-0000-000000000002','VIENES','vienes','Reggaetón',86,'B minor','Perreo oscuro',
   NULL,'/beats/vienes.mp3','/beats/vienes.mp3','published',false,now())
ON CONFLICT (id) DO UPDATE SET
  title=EXCLUDED.title, slug=EXCLUDED.slug, genre=EXCLUDED.genre, bpm=EXCLUDED.bpm,
  musical_key=EXCLUDED.musical_key, mood=EXCLUDED.mood, cover_path=EXCLUDED.cover_path,
  preview_path=EXCLUDED.preview_path, master_path=EXCLUDED.master_path,
  status=EXCLUDED.status, featured=EXCLUDED.featured, sort_date=EXCLUDED.sort_date;

-- Storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('covers','covers',true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('previews','previews',true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('masters','masters',false) ON CONFLICT (id) DO NOTHING;

-- Storage policies: covers (public read, admin write)
DROP POLICY IF EXISTS "public_read_covers" ON storage.objects;
CREATE POLICY "public_read_covers" ON storage.objects
  FOR SELECT TO anon, authenticated USING (bucket_id = 'covers');
DROP POLICY IF EXISTS "admin_write_covers" ON storage.objects;
CREATE POLICY "admin_write_covers" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'covers' AND public.is_admin());
DROP POLICY IF EXISTS "admin_update_covers" ON storage.objects;
CREATE POLICY "admin_update_covers" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'covers' AND public.is_admin()) WITH CHECK (bucket_id = 'covers' AND public.is_admin());
DROP POLICY IF EXISTS "admin_delete_covers" ON storage.objects;
CREATE POLICY "admin_delete_covers" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'covers' AND public.is_admin());

-- Storage policies: previews (public read, admin write)
DROP POLICY IF EXISTS "public_read_previews" ON storage.objects;
CREATE POLICY "public_read_previews" ON storage.objects
  FOR SELECT TO anon, authenticated USING (bucket_id = 'previews');
DROP POLICY IF EXISTS "admin_write_previews" ON storage.objects;
CREATE POLICY "admin_write_previews" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'previews' AND public.is_admin());
DROP POLICY IF EXISTS "admin_update_previews" ON storage.objects;
CREATE POLICY "admin_update_previews" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'previews' AND public.is_admin()) WITH CHECK (bucket_id = 'previews' AND public.is_admin());
DROP POLICY IF EXISTS "admin_delete_previews" ON storage.objects;
CREATE POLICY "admin_delete_previews" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'previews' AND public.is_admin());

-- Storage policies: masters (admin only, no public read)
DROP POLICY IF EXISTS "admin_write_masters" ON storage.objects;
CREATE POLICY "admin_write_masters" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'masters' AND public.is_admin());
DROP POLICY IF EXISTS "admin_update_masters" ON storage.objects;
CREATE POLICY "admin_update_masters" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'masters' AND public.is_admin()) WITH CHECK (bucket_id = 'masters' AND public.is_admin());
DROP POLICY IF EXISTS "admin_delete_masters" ON storage.objects;
CREATE POLICY "admin_delete_masters" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'masters' AND public.is_admin());
DROP POLICY IF EXISTS "admin_read_masters" ON storage.objects;
CREATE POLICY "admin_read_masters" ON storage.objects
  FOR SELECT TO authenticated USING (bucket_id = 'masters' AND public.is_admin());