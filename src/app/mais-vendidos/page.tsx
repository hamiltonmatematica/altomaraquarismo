'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import ProductCard from '@/components/ui/product-card';
import { getMostClickedProducts } from '@/lib/data';
import { Product } from '@/types/database';

export default function MaisVendidosPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const prods = await getMostClickedProducts(20);
            setProducts(prods);
            setLoading(false);
        }
        load();
    }, []);

    return (
        <div className="relative flex min-h-screen flex-col">
            <Header />

            <main className="flex-1">
                <section className="mx-auto max-w-7xl px-6 py-12">
                    <div className="mb-10">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="material-symbols-outlined text-3xl text-primary">trending_up</span>
                            <h1 className="text-4xl font-black tracking-tight">Mais Vendidos</h1>
                        </div>
                        <p className="text-slate-500 font-medium">Os produtos mais populares do nosso catálogo</p>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                            {[1, 2, 3, 4].map(i => (
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
