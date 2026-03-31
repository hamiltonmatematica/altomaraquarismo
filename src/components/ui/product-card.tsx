'use client';

import Link from 'next/link';
import { Product } from '@/types/database';
import { useQuoteCart } from '@/contexts/quote-cart-context';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const { addItem } = useQuoteCart();
    const mainImage = product.images?.find(img => img.is_main)?.url || product.images?.[0]?.url || '';

    return (
        <Link
            href={`/produto/${product.slug}`}
            className="bg-white dark:bg-slate-900 rounded-[24px] md:rounded-3xl p-2.5 md:p-3 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col gap-2 md:gap-4 group cursor-pointer transition-all hover:shadow-xl hover:border-primary/20 relative"
        >
            <div className="relative w-full aspect-square rounded-[18px] md:rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                {mainImage ? (
                    mainImage.toLowerCase().split('?')[0].match(/\.(mp4|mov|webm|ogg|m4v)$/) ? (
                        <video
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 md:group-hover:scale-110"
                            src={mainImage}
                            muted
                            loop
                            playsInline
                            crossOrigin="anonymous"
                            preload="metadata"
                            onMouseEnter={(e) => e.currentTarget.play().catch(() => {})}
                            onMouseLeave={(e) => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }}
                        />
                    ) : (
                        <img
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 md:group-hover:scale-110"
                            alt={product.name}
                            src={mainImage}
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDBwJSIgaGVpZ2h0PSIxMDBwJSI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2U1ZTdlYiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIyNCIgZmlsbD0iIzlmYTZiMiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+U2VtIEZvdG88L3RleHQ+PC9zdmc+';
                            }}
                        />
                    )
                ) : (
                    <div className="flex flex-col items-center justify-center text-slate-400">
                        <span className="material-symbols-outlined text-4xl mb-1 opacity-50">shopping_bag</span>
                        <span className="text-[10px] font-medium tracking-widest uppercase opacity-70">Sem Foto</span>
                    </div>
                )}

                {product.tag && (
                    <div className="absolute top-2.5 md:top-3 left-2.5 md:left-3">
                        <span className={`rounded-full px-2 py-0.5 md:px-3 md:py-1 text-[9px] md:text-[10px] font-bold uppercase tracking-wider text-white shadow-lg ${product.tag.toLowerCase() === 'promoção' ? 'bg-red-600' : 'bg-primary'}`}>
                            {product.tag}
                        </span>
                    </div>
                )}

                <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors z-10 md:hidden"
                    title="Favoritar"
                >
                    <span className="material-symbols-outlined text-[18px] fill-current">favorite</span>
                </button>
            </div>

            <div className="px-1.5 md:px-2 pb-1 md:pb-2 flex flex-col gap-1 md:gap-0">
                <h3 className="font-bold text-sm md:text-lg text-slate-800 dark:text-slate-100 leading-tight line-clamp-2 md:line-clamp-1 min-h-[40px] md:min-h-0 group-hover:text-primary transition-colors">
                    {product.name}
                </h3>

                <p className="hidden md:block text-sm text-slate-500 font-medium line-clamp-1">{product.description}</p>
                <p className="md:hidden text-[11px] text-slate-500 font-medium line-clamp-1">{product.description}</p>

                {product.code && (
                    <p className="text-[10px] md:text-xs text-slate-400 mt-1 md:mt-1">Cód: {product.code}</p>
                )}

                <div className="flex items-center justify-between mt-1 md:mt-3">
                    <div className="flex flex-col md:flex-row md:items-baseline">
                        <div className="flex items-baseline gap-1">
                            <span className="font-black text-primary text-sm md:text-xl">R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                    </div>
                    <button
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); addItem(product); }}
                        className="w-8 h-8 md:w-auto md:h-auto shrink-0 rounded-full md:p-2.5 bg-slate-900 md:bg-primary/10 dark:bg-primary md:dark:bg-primary/10 text-white md:text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-colors hover:scale-110 z-10"
                        title="Incluir no orçamento"
                    >
                        <span className="material-symbols-outlined text-[18px] md:text-xl">add_shopping_cart</span>
                    </button>
                </div>

                {product.production_time && (
                    <p className="text-[10px] md:text-xs text-green-600 font-semibold mt-1 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[12px]">check_circle</span>
                        {product.production_time}
                    </p>
                )}
            </div>
        </Link>
    );
}
