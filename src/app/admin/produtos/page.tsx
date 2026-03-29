'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAllProducts, getAllCategories } from '@/lib/data';
import { deleteProductAction } from '@/lib/admin-actions';
import { Product, Category } from '@/types/database';

export default function AdminProdutosPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [sortBy, setSortBy] = useState('az');

    useEffect(() => {
        async function load() {
            const [prods, cats] = await Promise.all([getAllProducts(), getAllCategories()]);
            setProducts(prods);
            setCategories(cats);
            setLoading(false);
        }
        load();
    }, []);

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Excluir "${name}"?`)) return;
        try {
            await deleteProductAction(id);
            setProducts(prev => prev.filter(p => p.id !== id));
            alert('Produto excluído com sucesso.');
        } catch (err: any) {
            alert('Erro: ' + err.message);
        }
    };

    let filtered = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || (p.code || '').toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = categoryFilter === 'all' || p.category_id === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    filtered.sort((a, b) => {
        if (sortBy === 'az') return a.name.localeCompare(b.name);
        if (sortBy === 'za') return b.name.localeCompare(a.name);
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    return (
        <div className="flex-1 p-4 lg:p-8 bg-slate-950 min-h-screen text-white">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                <div>
                    <Link href="/admin" className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-cyan-400 transition-colors mb-2">
                        ← Voltar ao Dashboard
                    </Link>
                    <h1 className="text-2xl lg:text-3xl font-black text-white">Produtos</h1>
                    <p className="text-slate-400 mt-1 text-sm">{products.length} produtos cadastrados</p>
                </div>
                <Link
                    href="/admin/produtos/novo"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-600 px-6 py-3 text-white font-bold hover:bg-cyan-500 transition-all shadow-lg shadow-cyan-500/20"
                >
                    + Novo Produto
                </Link>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                    <span className="material-symbols-outlined absolute left-4 top-3.5 text-slate-500 text-lg">search</span>
                    <input 
                        type="text" placeholder="Buscar por nome ou código..." 
                        value={searchQuery} onChange={e => setSearchQuery(e.target.value)} 
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-12 pr-4 py-3 text-sm outline-none focus:border-cyan-500 transition-colors placeholder-slate-500" 
                    />
                </div>
                <select 
                    value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} 
                    className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-cyan-500 transition-colors w-full md:w-auto appearance-none"
                >
                    <option value="all">Todas as Categorias</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <select 
                    value={sortBy} onChange={e => setSortBy(e.target.value)} 
                    className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-cyan-500 transition-colors w-full md:w-auto appearance-none"
                >
                    <option value="az">A-Z (Alfabética)</option>
                    <option value="za">Z-A</option>
                    <option value="newest">Mais Recentes</option>
                    <option value="price-asc">Menor Preço</option>
                    <option value="price-desc">Maior Preço</option>
                </select>
            </div>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="bg-slate-800 rounded-2xl p-6 animate-pulse h-24" />
                    ))}
                </div>
            ) : (
                <div className="space-y-3">
                    {filtered.map(p => {
                        const mainImage = p.images?.find(i => i.is_main) || p.images?.[0];
                        return (
                            <div key={p.id} className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-800 rounded-2xl p-4 lg:p-5 border border-slate-700 hover:border-cyan-500/30 transition-all gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-slate-900 rounded-xl overflow-hidden flex-shrink-0 border border-slate-700">
                                        {mainImage ? (
                                            mainImage.url.toLowerCase().split('?')[0].match(/\.(mp4|mov|webm|ogg|m4v)$/) ? (
                                                <video src={mainImage.url} className="w-full h-full object-cover" muted playsInline preload="metadata" crossOrigin="anonymous" />
                                            ) : (
                                                <img src={mainImage.url} alt={p.name} className="w-full h-full object-cover" />
                                            )
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-600 text-2xl">🐟</div>
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-bold text-white text-sm lg:text-base truncate">{p.name}</h3>
                                            {p.featured && <span className="text-orange-400 text-xs">★</span>}
                                        </div>
                                        <p className="text-xs text-slate-400">
                                            {p.category?.name || 'Sem categoria'} · REF: {p.code || 'S/N'}
                                        </p>
                                        <p className="text-cyan-400 font-bold text-sm">
                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(p.price)}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between sm:justify-end gap-2 border-t sm:border-t-0 border-slate-700/50 pt-3 sm:pt-0">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${p.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                        {p.status === 'active' ? 'Ativo' : 'Rascunho'}
                                    </span>
                                    <div className="flex items-center gap-1">
                                        <Link
                                            href={`/admin/produtos/novo?id=${p.id}`}
                                            className="p-2 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all"
                                        >
                                            ✎
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(p.id, p.name)}
                                            className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                                        >
                                            🗑
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    {filtered.length === 0 && (
                        <div className="py-20 text-center text-slate-500">Nenhum produto encontrado.</div>
                    )}
                </div>
            )}
        </div>
    );
}
