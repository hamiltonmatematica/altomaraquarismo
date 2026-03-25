import { supabase, isSupabaseConfigured } from './supabase';
import { MOCK_CATEGORIES, MOCK_PRODUCTS } from './mock-data';
import { Category, Product } from '@/types/database';

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
