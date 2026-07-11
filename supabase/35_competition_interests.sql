-- Tabel Competition Interests (Minat Lomba)
CREATE TABLE IF NOT EXISTS public.competition_interests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    competition_id UUID NOT NULL REFERENCES public.competitions(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'Berminat', -- 'Berminat', 'Ditolak', 'Diinkubasi', 'Berpartisipasi', 'Selesai'
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(competition_id, student_id)
);

-- Mengaktifkan RLS (Row Level Security)
ALTER TABLE public.competition_interests ENABLE ROW LEVEL SECURITY;

-- Memberikan Hak Akses ke Tabel
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.competition_interests TO authenticated;
GRANT SELECT ON TABLE public.competition_interests TO anon;

-- Hak Akses (Policies)
    FOR SELECT USING (
        auth.uid() = parent_id OR 
        EXISTS (SELECT 1 FROM public.user_roles WHERE user_roles.id = auth.uid() AND role IN ('Admin', 'Guru', 'Wali Kelas'))
    );

CREATE POLICY "Parents can insert their own interests" ON public.competition_interests
    FOR INSERT WITH CHECK (
        auth.uid() = parent_id
    );

CREATE POLICY "Admin/Teachers can update interests" ON public.competition_interests
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM public.user_roles WHERE user_roles.id = auth.uid() AND role IN ('Admin', 'Guru', 'Wali Kelas'))
    );

CREATE POLICY "Parents can delete their own interests" ON public.competition_interests
    FOR DELETE USING (
        auth.uid() = parent_id
    );

-- Trigger updated_at
CREATE TRIGGER handle_updated_at_competition_interests
    BEFORE UPDATE ON public.competition_interests
    FOR EACH ROW
    EXECUTE PROCEDURE public.handle_updated_at();
