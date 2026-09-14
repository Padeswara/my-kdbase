-- =========================================================
-- SQL Schema untuk Database Site Management di Supabase
-- =========================================================
-- Cara Penggunaan:
-- 1. Buka Supabase Dashboard (https://app.supabase.com)
-- 2. Pilih Project Anda -> Buka menu "SQL Editor"
-- 3. Tempel (paste) seluruh query ini, lalu klik "RUN"
-- =========================================================

-- 1. Buat tabel sites
CREATE TABLE IF NOT EXISTS public.sites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    image_url TEXT,
    company_name TEXT NOT NULL,
    address TEXT NOT NULL,
    pic_name TEXT NOT NULL,
    pic_phone TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('On Going', 'Pending', 'Approve', 'Decline')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Aktifkan Row Level Security (RLS)
ALTER TABLE public.sites ENABLE ROW LEVEL SECURITY;

-- 3. Kebijakan RLS (Public Access untuk Anon Key)
-- Mengizinkan membaca data
CREATE POLICY "Allow public read access"
ON public.sites FOR SELECT
TO anon, authenticated
USING (true);

-- Mengizinkan menambah data
CREATE POLICY "Allow public insert access"
ON public.sites FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Mengizinkan mengubah data (termasuk update status langsung dari tabel)
CREATE POLICY "Allow public update access"
ON public.sites FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- Mengizinkan menghapus data
CREATE POLICY "Allow public delete access"
ON public.sites FOR DELETE
TO anon, authenticated
USING (true);

-- 4. Buat Storage Bucket untuk foto/gambar site
INSERT INTO storage.buckets (id, name, public)
VALUES ('site-images', 'site-images', true)
ON CONFLICT (id) DO NOTHING;

-- Kebijakan Storage agar gambar bisa di-upload dan diakses publik
CREATE POLICY "Public Access site-images"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'site-images');

CREATE POLICY "Public Upload site-images"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'site-images');

CREATE POLICY "Public Delete site-images"
ON storage.objects FOR DELETE
TO anon, authenticated
USING (bucket_id = 'site-images');

-- 5. Contoh data awal (opsional)
INSERT INTO public.sites (company_name, address, pic_name, pic_phone, status, notes, image_url)
VALUES 
('PT Teknologi Nusantara', 'Jl. Jendral Sudirman No. 45, Jakarta Selatan', 'Budi Santoso', '081234567890', 'On Going', 'Instalasi jaringan server tahap 1', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400'),
('CV Mitra Mandiri', 'Jl. Pemuda No. 12, Surabaya', 'Siti Rahma', '085712345678', 'Approve', 'Dokumentasi kontrak telah diverifikasi', 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400'),
('PT Samudra Logistics', 'Kawasan Industri Cikarang Blok B4, Bekasi', 'Hendra Wijaya', '081398765432', 'Pending', 'Menunggu persetujuan direksi', 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400')
ON CONFLICT DO NOTHING;

