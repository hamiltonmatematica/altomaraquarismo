'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import ProductCard from '@/components/ui/product-card';
import { getProducts, getCategories } from '@/lib/data';
import { Category, Product } from '@/types/database';

function CatalogoContent() {
    const searchParams = useSearchParams();
    const categoriaParam = searchParams.get('categoria');

    const [categories, setCategories] = useState<Category[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            setLoading(true);
            const initialCategory = categoriaParam || null;
            setActiveCategory(initialCategory);

            const [cats, prods] = await Promise.all([
                getCategories(),
                getProducts(initialCategory || undefined)
            ]);

            setCategories(cats);
            setProducts(prods);
            setLoading(false);
        }
        load();
    }, [categoriaParam]);

    const handleCategoryClick = async (slug: string | null) => {
        setActiveCategory(slug);
        setLoading(true);
        const prods = slug ? await getProducts(slug) : await getProducts();
        setProducts(prods);
        setLoading(false);
    };

    return (
        <div className="relative flex min-h-screen flex-col">
            <Header />

            <main className="flex-1">
                <div className="w-full bg-white dark:bg-slate-900/50 shadow-sm sticky top-[73px] z-40">
                    <div className="mx-auto flex max-w-7xl items-center gap-8 overflow-x-auto px-6 py-2 no-scrollbar">
                        <button
                            onClick={() => handleCategoryClick(null)}
                            className={`flex flex-shrink-0 items-center gap-2 py-3 border-b-2 transition-all font-bold text-sm ${activeCategory === null ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-primary'}`}
                        >
                            <span className="material-symbols-outlined text-sm">apps</span>
                            Todos
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => handleCategoryClick(cat.slug)}
                                className={`flex flex-shrink-0 items-center gap-2 py-3 border-b-2 transition-all font-bold text-sm ${activeCategory === cat.slug ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-primary'}`}
                            >
                                <span className="material-symbols-outlined text-sm">{cat.icon}</span>
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>

                <section className="mx-auto max-w-7xl px-6 py-12">
                    <div className="mb-10">
                        <h1 className="text-4xl font-black tracking-tight">Catálogo Completo</h1>
                        <p className="mt-2 text-slate-500 font-medium">
                            {activeCategory ? `Categoria: ${categories.find(c => c.slug === activeCategory)?.name}` : 'Explore todos os nossos produtos'}
                        </p>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                                <div key={i} className="rounded-3xl bg-white dark:bg-slate-900 p-3 border border-primary/5">
                                    <div className="aspect-square rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
                                    <div className="mt-4 px-2 space-y-2">
                                        <div className="h-5 bg-slate-100 dark:bg-slate-800 rounded animate-pulse w-3/4" />
                                        <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded animate-pulse w-1/2" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : products.length === 0 ? (
                        <div className="text-center py-20">
                            <span className="material-symbols-outlined text-6xl text-slate-300 mb-4 block">inventory_2</span>
                            <p className="text-slate-500 font-medium text-lg">Nenhum produto encontrado</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                            {products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}
                </section>
            </main>

            <Footer />
        </div>
    );
}

export default function CatalogoPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        }>
            <CatalogoContent />
        </Suspense>
    );
}
