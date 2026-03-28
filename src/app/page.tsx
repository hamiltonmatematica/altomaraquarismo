'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { icons } from 'lucide-react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import ProductCard from '@/components/ui/product-card';
import { getCategories, getFeaturedProducts, getNewestProducts, getProducts } from '@/lib/data';
import { Category, Product } from '@/types/database';

function DynamicLucideIcon({ name }: { name: string }) {
    if (!name) return <span className="material-symbols-outlined text-[28px] sm:text-[32px]">help</span>;
    
    // Converte kebab-case para CamelCase ou Capitalize
    // Ex: "fish" -> "Fish", "settings" -> "Settings"
    const camelName = name.replace(/-./g, x => x[1].toUpperCase()).replace(/^./, x => x.toUpperCase());
    
    const LucideIcon = (icons as any)[camelName];
    
    if (!LucideIcon) {
        return <span className="material-symbols-outlined text-[28px] sm:text-[32px]">{name}</span>;
    }
    
    return <LucideIcon className="w-7 h-7 sm:w-8 sm:h-8" strokeWidth={1.5} />;
}

export default function Home() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [newestProducts, setNewestProducts] = useState<Product[]>([]);
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const [cats, prods, latest] = await Promise.all([
                getCategories(),
                getFeaturedProducts(),
                getNewestProducts(20)
            ]);
            setCategories(cats);
            setProducts(prods);
            setNewestProducts(latest);
            setLoading(false);
        }
        load();
    }, []);

    const handleCategoryClick = async (slug: string | null) => {
        setActiveCategory(slug);
        setLoading(true);
        const prods = slug ? await getProducts(slug) : await getFeaturedProducts();
        setProducts(prods);
        setLoading(false);
    };

    return (
        <div className="relative flex min-h-screen flex-col">
            <Header />

            <main className="flex-1">
                {/* Mobile Search Bar */}
                <div className="md:hidden px-4 pt-4 pb-2 w-full">
                    <div className="relative w-full">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <span className="material-symbols-outlined text-primary text-xl">search</span>
                        </div>
                        <input
                            className="w-full bg-cyan-50/50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm rounded-3xl pl-11 pr-4 py-3.5 outline-none focus:ring-2 focus:ring-primary/20 border-none placeholder-slate-400 font-medium transition-all"
                            placeholder="Pesquisar corais, peixes..."
                            type="text"
                        />
                    </div>
                </div>

                {/* Hero Banner */}
                <section className="mx-auto max-w-7xl px-4 sm:px-6 py-4">
                    <div className="relative overflow-hidden rounded-[2rem] sm:rounded-3xl bg-slate-900 aspect-[4/3] sm:aspect-[21/9] flex items-center justify-center text-center group">
                        <div className="absolute inset-0 z-0">
                            <div className="absolute inset-0 bg-black/40 z-[1]" />
                            <img
                                className="h-full w-full object-cover opacity-100 transition-transform duration-1000 group-hover:scale-105"
                                alt="Aquarismo marinho"
                                src="/hero.png"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-[2]" />
                        </div>
                        <div className="relative z-10 w-full px-4 sm:px-12 mt-8 sm:mt-0 max-w-2xl">
                            <h2 className="mb-2 sm:mb-4 text-3xl sm:text-5xl font-black tracking-tight text-white lg:text-7xl drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">Alto Mar Aquarismo</h2>
                            <p className="mb-6 sm:mb-8 text-sm sm:text-lg font-bold text-white lg:text-xl hidden sm:block drop-shadow-[0_1px_5px_rgba(0,0,0,0.5)]">
                                Corais, peixes e tudo que seu reef precisa. Qualidade e procedência garantida.
                            </p>
                            <Link href="/catalogo" className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 sm:px-8 sm:py-4 text-sm sm:text-lg font-bold text-white shadow-xl shadow-primary/30 hover:bg-primary/90 hover:scale-105 transition-all">
                                Ver Catálogo
                                <span className="material-symbols-outlined text-lg sm:text-2xl group-hover:translate-x-1 transition-transform">arrow_forward</span>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Categories */}
                <section className="mx-auto max-w-7xl px-4 sm:px-6 py-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 dark:text-slate-100">Categorias</h2>
                        <button
                            onClick={() => handleCategoryClick(null)}
                            className="text-sm font-semibold text-primary hover:text-primary/80"
                        >
                            Ver Todos
                        </button>
                    </div>
                    <div className="flex overflow-x-auto gap-4 sm:gap-8 pb-4 no-scrollbar">
                        {categories.map((cat, index) => {
                            const bgColors = [
                                'bg-cyan-50 text-cyan-500',
                                'bg-blue-50 text-blue-500',
                                'bg-teal-50 text-teal-500',
                                'bg-sky-50 text-sky-500',
                                'bg-indigo-50 text-indigo-500',
                                'bg-emerald-50 text-emerald-500'
                            ];
                            const colorClass = bgColors[index % bgColors.length];

                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => handleCategoryClick(cat.slug)}
                                    className="flex flex-col items-center gap-3 shrink-0 group"
                                >
                                    <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center transition-transform group-hover:scale-105 ${activeCategory === cat.slug ? 'ring-2 ring-primary ring-offset-2' : ''} ${colorClass}`}>
                                        <DynamicLucideIcon name={cat.icon} />
                                    </div>
                                    <span className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 text-center">{cat.name}</span>
                                </button>
                            );
                        })}
                    </div>
                </section>

                {/* Products Grid */}
                <section className="mx-auto max-w-7xl px-4 sm:px-6 py-6 pb-24 md:pb-12">
                    <div className="mb-6 flex items-center justify-between">
                        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 dark:text-slate-100">
                            {activeCategory ? categories.find(c => c.slug === activeCategory)?.name : 'Destaques'}
                        </h2>
                        <button className="text-slate-400 hover:text-primary flex items-center">
                            <span className="material-symbols-outlined">tune</span>
                        </button>
                    </div>

                    <div className="text-center w-full mb-6">
                        <p className="text-xs font-medium italic text-slate-500">🐠 Qualidade e Procedência Garantida 🪸</p>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-2 gap-4 sm:gap-8 lg:grid-cols-4">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-2">
                                    <div className="aspect-[4/5] rounded-[22px] bg-slate-100 dark:bg-slate-800 animate-pulse mb-3" />
                                    <div className="px-2 pb-2 space-y-2">
                                        <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded animate-pulse w-1/3" />
                                        <div className="h-5 bg-slate-100 dark:bg-slate-800 rounded animate-pulse w-3/4" />
                                        <div className="h-6 bg-slate-100 dark:bg-slate-800 rounded animate-pulse w-1/2 pt-2" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : products.length === 0 ? (
                        <div className="text-center py-16">
                            <span className="material-symbols-outlined text-5xl text-slate-300 mb-3 block">inventory_2</span>
                            <p className="text-slate-500 font-medium text-sm">Nenhum produto encontrado nesta categoria</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-4 sm:gap-8 lg:grid-cols-4">
                            {products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}
                </section>

                {/* New Arrivals Section */}
                {!activeCategory && newestProducts.length > 0 && (
                    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16 border-t border-slate-100 dark:border-slate-800/50">
                        <div className="mb-10">
                            <h2 className="text-4xl font-black tracking-tight">Últimas Chegadas</h2>
                            <p className="mt-2 text-slate-500 font-medium flex items-center justify-between">
                                As novidades mais recentes da nossa loja
                                <Link href="/catalogo" className="text-primary font-bold hover:underline flex items-center gap-1">
                                    Ver Todos
                                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                                </Link>
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 sm:gap-8 lg:grid-cols-4">
                            {newestProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </section>
                )}

            </main>

            <Footer />
        </div>
    );
}
