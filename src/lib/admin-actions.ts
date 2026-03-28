'use server'

import { supabaseAdmin } from './supabase';
import { revalidatePath } from 'next/cache';
import { Category, Product } from '@/types/database';

// ====== CATEGORIAS ======

export async function saveCategory(category: Partial<Category>) {
    if (!supabaseAdmin) throw new Error('Supabase admin não configurado');

    const { id, ...data } = category;
    
    if (id) {
        // Update
        const { error } = await supabaseAdmin.from('categories').update(data).eq('id', id);
        if (error) throw error;
    } else {
        // Insert
        const { error } = await supabaseAdmin.from('categories').insert(data);
        if (error) throw error;
    }

    revalidatePath('/admin/categorias');
    revalidatePath('/catalogo');
    revalidatePath('/');
}

export async function deleteCategory(id: string) {
    if (!supabaseAdmin) throw new Error('Supabase admin não configurado');

    const { error } = await supabaseAdmin.from('categories').delete().eq('id', id);
    if (error) throw error;

    revalidatePath('/admin/categorias');
    revalidatePath('/catalogo');
    revalidatePath('/');
}

// ====== PRODUTOS (Seguro / RLS Bypass) ======

export async function uploadProductImageAction(formData: FormData): Promise<{ publicUrl: string | null; error: string | null }> {
    if (!supabaseAdmin) return { publicUrl: null, error: 'Supabase admin não configurado' };

    try {
        const file = formData.get('file') as File;
        if (!file) throw new Error('Nenhum arquivo enviado');

        const fileExt = file.name.split('.').pop();
        const cleanName = file.name.split('.')[0].replace(/[^a-zA-Z0-9]/g, '-');
        const fileName = `${cleanName}-${Math.random().toString(36).substring(2, 7)}-${Date.now()}.${fileExt}`;

        // supabaseAdmin usa service_role_key, ignorando regras de Storage RLS
        const { error: uploadError } = await supabaseAdmin.storage
            .from('products')
            .upload(fileName, file, { cacheControl: '3600', upsert: false });

        if (uploadError) return { publicUrl: null, error: uploadError.message };

        const { data: { publicUrl } } = supabaseAdmin.storage.from('products').getPublicUrl(fileName);
        return { publicUrl: `${publicUrl}?t=${Date.now()}`, error: null };
    } catch (err: any) {
        return { publicUrl: null, error: err.message };
    }
}

export async function saveProductAction(product: any, imagesUrl: string[]): Promise<{ error: string | null }> {
    if (!supabaseAdmin) return { error: 'Supabase admin não configurado' };

    try {
        const { id, images: oldImages, category, updated_at, created_at, ...data } = product;

        let productId = id;

        // supabaseAdmin usa service_role_key, ignorando as políticas RLS de produtos
        if (id) {
            const { error } = await supabaseAdmin.from('products').update(data).eq('id', id);
            if (error) throw error;
        } else {
            const { data: newProd, error } = await supabaseAdmin.from('products').insert(data).select('id').single();
            if (error) throw error;
            productId = newProd.id;
        }

        if (imagesUrl) {
            await supabaseAdmin.from('product_images').delete().eq('product_id', productId);
            if (imagesUrl.length > 0) {
                const imagesToInsert = imagesUrl.map((url, index) => ({
                    product_id: productId,
                    url,
                    sort_order: index,
                    is_main: index === 0
                }));
                await supabaseAdmin.from('product_images').insert(imagesToInsert);
            }
        }

        revalidatePath('/admin/produtos');
        revalidatePath('/catalogo');
        revalidatePath('/');
        return { error: null };
    } catch (err: any) {
        return { error: err.message };
    }
}

export async function deleteProductAction(id: string): Promise<{ error: string | null }> {
    if (!supabaseAdmin) return { error: 'Admin DB não configurado' };
    try {
        const { error } = await supabaseAdmin.from('products').delete().eq('id', id);
        if (error) throw error;
        revalidatePath('/admin/produtos');
        revalidatePath('/catalogo');
        return { error: null };
    } catch (err: any) {
        return { error: err.message };
    }
}
