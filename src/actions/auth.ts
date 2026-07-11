'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export async function login(formData: FormData) {
  try {
    const supabase = await createClient();

    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const { error, data } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };

    if (data?.user) {
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      // Block users who are still 'Siswa' (Pending Approval) or have no role
      if (!roleData || roleData.role === 'Siswa') {
        await supabase.auth.signOut();
        return { error: 'Akun Anda masih menunggu persetujuan Admin.' };
      }
    }

    return { success: true };
  } catch (e: any) {
    return { error: e.message || 'Terjadi kesalahan pada server.' };
  }
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const role = formData.get('role') as string;
  let studentId = formData.get('student_id') as string | null;

  if (role === 'Orang Tua') {
    const nis = formData.get('nis') as string;
    const dob = formData.get('date_of_birth') as string;
    
    if (!nis || !dob) {
      return { error: 'NIS dan Tanggal Lahir anak harus diisi.' };
    }
    
    const { data: student, error: studentError } = await supabase
      .from('students')
      .select('id')
      .eq('nis', nis)
      .eq('date_of_birth', dob)
      .single();
      
    if (studentError || !student) {
      return { error: 'Data siswa tidak ditemukan. Pastikan NIS dan Tanggal Lahir sesuai dengan data sekolah.' };
    }
    
    studentId = student.id;
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  // Jika berhasil daftar, simpan role yang diminta ke tabel pending_registrations
  if (data?.user) {
    const { error: pendingError } = await supabase.rpc('register_pending_user', {
      p_user_id: data.user.id,
      p_req_role: role || 'Guru',
      p_student_id: studentId || null
    });

    if (pendingError) {
      console.error('Error saving pending registration:', pendingError.message);
    }
  }

  return { success: true };
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/login');
}
