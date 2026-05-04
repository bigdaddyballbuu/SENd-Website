CREATE TABLE public.blogs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  category text NOT NULL,
  excerpt text,
  content text,
  image_url text,
  read_time text DEFAULT '5 นาที',
  active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- เปิด RLS (Row Level Security) เพื่อความปลอดภัย (ใครๆ ก็อ่านได้ แต่จะเขียนต้องเป็น admin/มี key ที่ถูกต้อง)
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on blogs"
  ON public.blogs
  FOR SELECT
  USING (true);

CREATE POLICY "Allow all access for authenticated users on blogs"
  ON public.blogs
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');
