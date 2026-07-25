-- =====================================================
-- MIGRATION: Tambah Kolom execution_date di Competitions
-- Jalankan di Supabase Dashboard > SQL Editor
-- =====================================================

ALTER TABLE public.competitions ADD COLUMN IF NOT EXISTS execution_date date;
