import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Logo from '@/components/ui/logo';
import { useQuoteCart } from '@/contexts/quote-cart-context';
import { searchProducts } from '@/lib/data';
import { Product } from '@/types/database';

export default function Header() {
    const { itemCount, setIsOpen } = useQuoteCart();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Product[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowResults(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (searchQuery.length >= 2) {
                setIsSearching(true);
                const results = await searchProducts(searchQuery);
                setSearchResults(results);
                setIsSearching(false);
                setShowResults(true);
            } else {
                setSearchResults([]);
                setShowResults(false);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-primary/10 bg-white/95 backdrop-blur-md dark:bg-background-dark/95">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-3">
                <div className="flex items-center md:gap-10">
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="flex md:hidden h-10 w-10 shrink-0 items-center justify-start text-primary transition-all"
                    >
                        <span className="material-symbols-outlined text-3xl">{mobileMenuOpen ? 'close' : 'menu'}</span>
                    </button>

                    <div className="hidden md:flex items-center gap-10">
                        <Logo />
                        <div className="relative group" ref={searchRef}>
                            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                <span className={`material-symbols-outlined ${isSearching ? 'animate-spin' : 'text-primary/60'}`}>
                                    {isSearching ? 'progress_activity' : 'search'}
                                </span>
                            </div>
                            <input
                                className="block w-96 rounded-full border-0 bg-primary/5 py-2.5 pl-11 pr-4 text-sm focus:ring-2 focus:ring-primary/20 placeholder:text-slate-400 transition-all outline-none"
                                placeholder="Pesquisar corais, peixes, equipamentos..."
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
                            />

                            {showResults && (
                                <div className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
                                    <div className="max-h-[70vh] overflow-y-auto p-2 space-y-1">
                                        {searchResults.length > 0 ? (
                                            searchResults.map((product) => (
                                                <Link
                                                    key={product.id}
                                                    href={`/produto/${product.slug}`}
                                                    onClick={() => setShowResults(false)}
                                                    className="flex items-center gap-4 p-2 rounded-xl hover:bg-primary/5 transition-all group"
                                                >
                                                    <div className="w-14 h-14 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                                                        <img
                                                            src={product.images?.[0]?.url || ''}
                                                            alt={product.name}
                                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-primary transition-colors">
                                                            {product.name}
                                                        </h4>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-[10px] text-slate-400 font-medium">{product.code}</span>
                                                            <span className="text-[10px] text-primary font-black">R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                                        </div>
                                                    </div>
                                                    <span className="material-symbols-outlined text-slate-300 text-sm group-hover:translate-x-1 transition-transform">chevron_right</span>
                                                </Link>
                                            ))
                                        ) : (
                                            <div className="py-8 text-center">
                                                <span className="material-symbols-outlined text-slate-300 text-4xl mb-2">search_off</span>
                                                <p className="text-sm text-slate-500 font-medium">Nenhum resultado para &quot;{searchQuery}&quot;</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="md:hidden flex-1 flex justify-center">
                    <Logo size="sm" />
                </div>

                <nav className="hidden md:flex items-center gap-8">
                    <Link href="/" className="text-sm font-semibold hover:text-primary transition-colors">Home</Link>
                    <Link href="/catalogo" className="text-sm font-semibold hover:text-primary transition-colors">Catálogo</Link>
                    <Link href="/novidades" className="text-sm font-semibold hover:text-primary transition-colors">Novidades</Link>
                </nav>

                <div className="flex items-center justify-end w-10 shrink-0 md:w-auto">
                    <button
                        onClick={() => setIsOpen(true)}
                        className="relative flex h-10 w-10 items-center justify-center rounded-full bg-cyan-50 dark:bg-primary/20 text-primary hover:bg-primary hover:text-white transition-all"
                    >
                        <span className="material-symbols-outlined text-[20px] sm:text-[22px]">shopping_bag</span>
                        {itemCount > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white border-2 border-background-light">
                                {itemCount}
                            </span>
                        )}
                    </button>
                </div>
            </div>

            {mobileMenuOpen && (
                <div className="md:hidden border-t border-primary/10 bg-white dark:bg-background-dark backdrop-blur-md px-4 py-4 space-y-1">
                    <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold hover:bg-primary/5 hover:text-primary transition-all">
                        <span className="material-symbols-outlined text-lg">home</span>
                        Home
                    </Link>
                    <Link href="/catalogo" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold hover:bg-primary/5 hover:text-primary transition-all">
                        <span className="material-symbols-outlined text-lg">grid_view</span>
                        Catálogo
                    </Link>
                    <Link href="/novidades" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold hover:bg-primary/5 hover:text-primary transition-all">
                        <span className="material-symbols-outlined text-lg">new_releases</span>
                        Novidades
                    </Link>
                    <Link href="/mais-vendidos" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold hover:bg-primary/5 hover:text-primary transition-all">
                        <span className="material-symbols-outlined text-lg">trending_up</span>
                        Mais Vendidos
                    </Link>
                </div>
            )}
        </header>
    );
}
