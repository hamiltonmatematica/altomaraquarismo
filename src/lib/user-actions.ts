'use server'

import { supabaseAdmin } from './supabase';
import { revalidatePath } from 'next/cache';

/** Cria usuário com nome, email e senha - sem confirmação de email */
export async function createNewUser(email: string, password: string, name: string) {
    if (!supabaseAdmin) throw new Error('Supabase admin não configurado');

    const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // confirma imediatamente, sem email
        user_metadata: { full_name: name },
    });

    if (error) throw error;

    revalidatePath('/admin/usuarios');
    return data.user;
}

/** Envia link de reset de senha para o email do usuário */
export async function sendPasswordReset(email: string): Promise<void> {
    if (!supabaseAdmin) throw new Error('Supabase admin não configurado');

    const { error } = await supabaseAdmin.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/admin/perfil`,
    });

    if (error) throw error;
}

/** Gera uma senha temporária aleatória e aplica diretamente no usuário */
export async function generateTempPassword(userId: string): Promise<string> {
    if (!supabaseAdmin) throw new Error('Supabase admin não configurado');

    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789@#!';
    const tempPassword = Array.from({ length: 12 }, () =>
        chars[Math.floor(Math.random() * chars.length)]
    ).join('');

    const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
        password: tempPassword,
    });

    if (error) throw error;

    return tempPassword;
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
