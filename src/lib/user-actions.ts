'use server'

import { supabaseAdmin } from './supabase';
import { revalidatePath } from 'next/cache';

export async function createNewUser(email: string) {
    if (!supabaseAdmin) throw new Error('Supabase admin não configurado');

    // Cria o usuário via Admin API (isso envia o convite por e-mail automaticamente se configurado no Supabase)
    // Se o invite estiver desligado, o usuário é criado mas não consegue logar até ter senha.
    // Usaremos invite para que ele defina sua própria senha.
    
    const { error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/admin/perfil`,
    });

    if (error) throw error;

    revalidatePath('/admin/usuarios');
}

export async function listAuthUsers() {
    if (!supabaseAdmin) throw new Error('Supabase admin não configurado');

    const { data, error } = await supabaseAdmin.auth.admin.listUsers();
    if (error) throw error;

    return data.users;
}

export async function deleteAuthUser(userId: string) {
    if (!supabaseAdmin) throw new Error('Supabase admin não configurado');

    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
    if (error) throw error;

    revalidatePath('/admin/usuarios');
}
