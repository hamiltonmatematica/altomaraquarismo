import { supabase, isSupabaseConfigured } from './supabase';
import { MOCK_CATEGORIES, MOCK_PRODUCTS } from './mock-data';
import { Category, Product } from '@/types/database';

// ======== CATEGORIAS - WRITE ========

export async function createCategory(cat: Partial<Category>): Promise<Category | null> {
    if (!isSupabaseConfigured) {
        const newCat: Category = { id: Date.now().toString(), name: cat.name || '', slug: cat.slug || '', icon: cat.icon || 'water', sort_order: cat.sort_order || 0, active: true, created_at: new Date().toISOString() };
        MOCK_CATEGORIES.push(newCat);
        return newCat;
    }
    const { data, error } = await supabase!.from('categories').insert(cat).select().single();
    if (error) { console.error(error); return null; }
    return data;
}

export async function updateCategory(id: string, updates: Partial<Category>): Promise<Category | null> {
    if (!isSupabaseConfigured) {
        const idx = MOCK_CATEGORIES.findIndex(c => c.id === id);
        if (idx >= 0) { Object.assign(MOCK_CATEGORIES[idx], updates); return MOCK_CATEGORIES[idx]; }
        return null;
    }
    const { data, error } = await supabase!.from('categories').update(updates).eq('id', id).select().single();
    if (error) { console.error(error); return null; }
    return data;
}

export async function deleteCategory(id: string): Promise<boolean> {
    if (!isSupabaseConfigured) {
        const idx = MOCK_CATEGORIES.findIndex(c => c.id === id);
        if (idx >= 0) { MOCK_CATEGORIES.splice(idx, 1); return true; }
        return false;
    }
    const { error } = await supabase!.from('categories').delete().eq('id', id);
    return !error;
}

// ======== PRODUTOS - WRITE ========

export interface CreateProductInput extends Partial<Product> {
    imageUrls?: string[];
}

export async function createProduct(product: CreateProductInput): Promise<{ data: Product | null; error: string | null }> {
    const { imageUrls, ...productData } = product;
    if (!isSupabaseConfigured) {
        const newP: Product = { id: Date.now().toString(), name: productData.name || '', slug: productData.slug || '', code: productData.code || null, description: productData.description || null, price: productData.price || 0, min_quantity: productData.min_quantity || 1, category_id: productData.category_id || null, status: productData.status || 'active', featured: productData.featured || false, tag: productData.tag || null, production_time: productData.production_time || null, click_count: 0, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), images: imageUrls?.map((url, i) => ({ id: Math.random().toString(), product_id: '', url, sort_order: i, is_main: i === 0 })) || [] };
        MOCK_PRODUCTS.push(newP);
        return { data: newP, error: null };
    }
    const { data: newProduct, error: pError } = await supabase!.from('products').insert(productData).select().single();
    if (pError) { console.error(pError); return { data: null, error: pError.message }; }
    if (imageUrls && imageUrls.length > 0 && newProduct) {
        const imagesToInsert = imageUrls.map((url, index) => ({ product_id: newProduct.id, url, sort_order: index, is_main: index === 0 }));
        const { error: iError } = await supabase!.from('product_images').insert(imagesToInsert);
        if (iError) return { data: newProduct, error: `Produto criado, mas erro nas imagens: ${iError.message}` };
    }
    return { data: newProduct, error: null };
}

export async function updateProduct(id: string, updates: Partial<Product> & { imageUrls?: string[] }): Promise<{ data: Product | null; error: string | null }> {
    const { imageUrls, ...productUpdates } = updates;
    if (!isSupabaseConfigured) {
        const idx = MOCK_PRODUCTS.findIndex(p => p.id === id);
        if (idx >= 0) { Object.assign(MOCK_PRODUCTS[idx], productUpdates, { updated_at: new Date().toISOString() }); if (imageUrls) MOCK_PRODUCTS[idx].images = imageUrls.map((url, i) => ({ id: Math.random().toString(), product_id: id, url, sort_order: i, is_main: i === 0 })); return { data: MOCK_PRODUCTS[idx], error: null }; }
        return { data: null, error: 'Produto não encontrado' };
    }
    const { data: updatedProduct, error: pError } = await supabase!.from('products').update({ ...productUpdates, updated_at: new Date().toISOString() }).eq('id', id).select().single();
    if (pError) { console.error(pError); return { data: null, error: pError.message }; }
    if (imageUrls && updatedProduct) {
        await supabase!.from('product_images').delete().eq('product_id', id);
        if (imageUrls.length > 0) {
            const imagesToInsert = imageUrls.map((url, index) => ({ product_id: id, url, sort_order: index, is_main: index === 0 }));
            const { error: iError } = await supabase!.from('product_images').insert(imagesToInsert);
            if (iError) return { data: updatedProduct, error: `Produto atualizado, mas erro nas imagens: ${iError.message}` };
        }
    }
    return { data: updatedProduct, error: null };
}

export async function deleteProduct(id: string): Promise<boolean> {
    if (!isSupabaseConfigured) {
        const idx = MOCK_PRODUCTS.findIndex(p => p.id === id);
        if (idx >= 0) { MOCK_PRODUCTS.splice(idx, 1); return true; }
        return false;
    }
    const { error } = await supabase!.from('products').delete().eq('id', id);
    return !error;
}

export async function uploadProductImage(file: File): Promise<{ publicUrl: string | null; error: string | null }> {
    if (!isSupabaseConfigured) return { publicUrl: URL.createObjectURL(file), error: null };
    try {
        const fileExt = file.name.split('.').pop();
        const lastDotIndex = file.name.lastIndexOf('.');
        const baseName = lastDotIndex !== -1 ? file.name.substring(0, lastDotIndex) : file.name;
        const cleanName = baseName.replace(/[^a-zA-Z0-9]/g, '-');
        const fileName = `${cleanName}-${Math.random().toString(36).substring(2, 7)}-${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase!.storage.from('products').upload(fileName, file, { cacheControl: '3600', upsert: false });
        if (uploadError) return { publicUrl: null, error: `Supabase Storage: ${uploadError.message}` };
        const { data: { publicUrl } } = supabase!.storage.from('products').getPublicUrl(fileName);
        return { publicUrl: `${publicUrl}?t=${Date.now()}`, error: null };
    } catch (err: any) {
        return { publicUrl: null, error: err.message || 'Erro desconhecido no upload' };
    }
}

// ======== CATEGORIAS ========

export async function getCategories(): Promise<Category[]> {
    if (!isSupabaseConfigured) return MOCK_CATEGORIES.filter(c => c.active);
    const { data, error } = await supabase!.from('categories').select('*').eq('active', true).order('sort_order');
    if (error) { console.error(error); return []; }
    return data || [];
}

export async function getAllCategories(): Promise<Category[]> {
    if (!isSupabaseConfigured) return MOCK_CATEGORIES;
    const { data, error } = await supabase!.from('categories').select('*').order('sort_order');
    if (error) { console.error(error); return []; }
    return data || [];
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
    if (!isSupabaseConfigured) return MOCK_CATEGORIES.find(c => c.slug === slug) || null;
    const { data, error } = await supabase!.from('categories').select('*').eq('slug', slug).single();
    if (error) return null;
    return data;
}

// ======== PRODUTOS ========

export async function getProducts(categorySlug?: string): Promise<Product[]> {
    if (!isSupabaseConfigured) {
        let products = MOCK_PRODUCTS.filter(p => p.status === 'active');
        if (categorySlug) {
            const cat = MOCK_CATEGORIES.find(c => c.slug === categorySlug);
            if (cat) products = products.filter(p => p.category_id === cat.id);
        }
        return products;
    }
    let query = supabase!.from('products').select('*, category:categories(*), images:product_images(*)').eq('status', 'active').order('created_at', { ascending: false });
    if (categorySlug) {
        const cat = await getCategoryBySlug(categorySlug);
        if (cat) query = query.eq('category_id', cat.id);
    }
    const { data, error } = await query;
    if (error) { console.error(error); return []; }
    return data || [];
}

export async function getFeaturedProducts(): Promise<Product[]> {
    if (!isSupabaseConfigured) return MOCK_PRODUCTS.filter(p => p.featured);
    const { data, error } = await supabase!.from('products').select('*, category:categories(*), images:product_images(*)').eq('featured', true).eq('status', 'active').order('created_at', { ascending: false });
    if (error) { console.error(error); return []; }
    return data || [];
}

export async function getAllProducts(): Promise<Product[]> {
    if (!isSupabaseConfigured) return MOCK_PRODUCTS;
    const { data, error } = await supabase!.from('products').select('*, category:categories(*), images:product_images(*)').order('created_at', { ascending: false });
    if (error) { console.error(error); return []; }
    return data || [];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
    if (!isSupabaseConfigured) return MOCK_PRODUCTS.find(p => p.slug === slug) || null;
    const { data, error } = await supabase!.from('products').select('*, category:categories(*), images:product_images(*)').eq('slug', slug).single();
    if (error) return null;
    return data;
}

export async function getRelatedProducts(productId: string, categoryId: string | null, productName?: string): Promise<Product[]> {
    if (!isSupabaseConfigured) {
        const others = MOCK_PRODUCTS.filter(p => p.id !== productId && p.status === 'active');
        const words = (productName || '').toLowerCase().split(/\s+/).filter(w => w.length > 3);
        const withSimilarity = others.map(p => {
            const nameWords = p.name.toLowerCase();
            const matchCount = words.filter(w => nameWords.includes(w)).length;
            const isSameCategory = p.category_id === categoryId;
            return { product: p, score: matchCount + (isSameCategory ? 5 : 0) };
        });
        withSimilarity.sort((a, b) => b.score - a.score);
        return withSimilarity.slice(0, 4).map(r => r.product);
    }
    const { data: sameCat } = await supabase!.from('products').select('*, category:categories(*), images:product_images(*)').neq('id', productId).eq('category_id', categoryId || '').eq('status', 'active').limit(4);
    if (sameCat && sameCat.length >= 4) return sameCat;
    const existingIds = [productId, ...(sameCat || []).map(p => p.id)];
    const { data: others } = await supabase!.from('products').select('*, category:categories(*), images:product_images(*)').not('id', 'in', `(${existingIds.join(',')})`).eq('status', 'active').order('click_count', { ascending: false }).limit(4 - (sameCat?.length || 0));
    return [...(sameCat || []), ...(others || [])].slice(0, 4);
}

export async function incrementProductClick(productId: string): Promise<void> {
    if (!isSupabaseConfigured) {
        const idx = MOCK_PRODUCTS.findIndex(p => p.id === productId);
        if (idx >= 0) MOCK_PRODUCTS[idx].click_count = (MOCK_PRODUCTS[idx].click_count || 0) + 1;
        return;
    }
    await supabase!.rpc('increment_click_count', { product_id: productId });
}

export async function getNewestProducts(limit: number = 10): Promise<Product[]> {
    if (!isSupabaseConfigured) {
        return [...MOCK_PRODUCTS]
            .filter(p => p.status === 'active')
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .slice(0, limit);
    }
    const { data, error } = await supabase!.from('products').select('*, category:categories(*), images:product_images(*)').eq('status', 'active').order('created_at', { ascending: false }).limit(limit);
    if (error) { console.error(error); return []; }
    return data || [];
}

export async function getMostClickedProducts(limit: number = 20): Promise<Product[]> {
    if (!isSupabaseConfigured) {
        return [...MOCK_PRODUCTS]
            .filter(p => p.status === 'active')
            .sort((a, b) => (b.click_count || 0) - (a.click_count || 0))
            .slice(0, limit);
    }
    const { data, error } = await supabase!.from('products').select('*, category:categories(*), images:product_images(*)').eq('status', 'active').order('click_count', { ascending: false }).limit(limit);
    if (error) { console.error(error); return []; }
    return data || [];
}

export async function searchProducts(query: string): Promise<Product[]> {
    if (!query) return [];
    if (!isSupabaseConfigured) {
        return MOCK_PRODUCTS.filter(p =>
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            p.description?.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 10);
    }
    const { data, error } = await supabase!
        .from('products')
        .select('*, category:categories(*), images:product_images(*)')
        .eq('status', 'active')
        .or(`name.ilike.%${query}%,code.ilike.%${query}%,description.ilike.%${query}%`)
        .limit(10);
    if (error) { console.error(error); return []; }
    return data || [];
}
