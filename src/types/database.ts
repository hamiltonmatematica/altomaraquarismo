// Tipos do banco de dados — Alto Mar Aquarismo

export interface Category {
    id: string;
    name: string;
    slug: string;
    icon: string;
    sort_order: number;
    active: boolean;
    created_at: string;
}

export interface Product {
    id: string;
    name: string;
    slug: string;
    code: string | null;
    description: string | null;
    price: number;
    min_quantity: number;
    category_id: string | null;
    status: 'active' | 'draft';
    featured: boolean;
    tag: string | null;
    production_time: string | null;
    click_count: number;
    created_at: string;
    updated_at: string;
    // Joined
    category?: Category;
    images?: ProductImage[];
}

export interface ProductImage {
    id: string;
    product_id: string;
    url: string;
    sort_order: number;
    is_main: boolean;
}

export interface QuoteCartItem {
    product: Product;
    quantity: number;
}
