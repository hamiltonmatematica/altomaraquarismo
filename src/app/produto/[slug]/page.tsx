'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import ProductCard from '@/components/ui/product-card';
import { useQuoteCart } from '@/contexts/quote-cart-context';
import { getProductBySlug, getRelatedProducts, incrementProductClick } from '@/lib/data';
import { Product } from '@/types/database';

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '553898416163';

export default function ProductPage({ params }: { params: { slug: string } }) {
    const [product, setProduct] = useState<Product | null>(null);
    const [related, setRelated] = useState<Product[]>([]);
    const [activeImage, setActiveImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
    const [showZoom, setShowZoom] = useState(false);
    const { addItem } = useQuoteCart();

    useEffect(() => {
        async function load() {
            const p = await getProductBySlug(params.slug);
            if (p) {
                setProduct(p);
                setQuantity(p.min_quantity || 1);
                incrementProductClick(p.id);
                const rel = await getRelatedProducts(p.id, p.category_id, p.name);
                setRelated(rel);
            }
            setLoading(false);
        }
        load();
    }, [params.slug]);

    if (loading) {
        return (
            <div className="relative flex min-h-screen flex-col">
                <Header />
                <main className="flex-1 mx-auto max-w-7xl px-6 py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                        <div className="aspect-square rounded-3xl bg-slate-100 animate-pulse" />
                        <div className="space-y-4">
                            <div className="h-4 bg-slate-100 rounded w-1/3 animate-pulse" />
                            <div className="h-10 bg-slate-100 rounded w-3/4 animate-pulse" />
                            <div className="h-8 bg-slate-100 rounded w-1/4 animate-pulse" />
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="relative flex min-h-screen flex-col">
                <Header />
                <main className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <span className="material-symbols-outlined text-6xl text-slate-300 mb-4 block">search_off</span>
                        <h2 className="text-2xl font-black mb-2">Produto não encontrado</h2>
                        <Link href="/" className="text-primary font-bold hover:underline">Voltar ao catálogo</Link>
                    </div>
                </main>
            </div>
        );
    }

    const images = product.images || [];
    const mainImage = images[activeImage]?.url || images[0]?.url || '';

    const handleWhatsAppSingle = () => {
        const msg = encodeURIComponent(
            `Olá! Gostaria de solicitar um orçamento para:\n\n*${product.name}*\n${product.code ? `Código: ${product.code}\n` : ''}Quantidade: ${quantity}\nValor unitário: R$ ${product.price.toFixed(2)}\n\nAguardo retorno!`
        );
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank');
    };

    const handleAddToCart = () => {
        addItem(product, quantity);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = ((e.pageX - left - window.scrollX) / width) * 100;
        const y = ((e.pageY - top - window.scrollY) / height) * 100;
        setZoomPos({ x, y });
    };

    return (
        <div className="relative flex min-h-screen flex-col">
            <Header />

            <div className="w-full bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-b border-slate-200/50 dark:border-slate-800/50">
                <div className="mx-auto max-w-7xl px-6 py-3 flex items-center gap-2 text-sm">
                    <Link href="/" className="text-slate-400 hover:text-primary transition-colors flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">home</span>
                        Início
                    </Link>
                    <span className="material-symbols-outlined text-slate-300 text-sm">chevron_right</span>
                    {product.category && (
                        <>
                            <Link
                                href={`/catalogo?categoria=${product.category.slug}`}
                                className="text-slate-400 hover:text-primary transition-colors"
                            >
                                {product.category.name}
                            </Link>
                            <span className="material-symbols-outlined text-slate-300 text-sm">chevron_right</span>
                        </>
                    )}
                    <span className="text-slate-700 dark:text-slate-200 font-semibold">{product.name}</span>
                </div>
            </div>

            <main className="flex-1">
                <div className="mx-auto max-w-7xl px-6 py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                        {/* Image Gallery */}
                        <div className="flex gap-4">
                            {images.length > 1 && (
                                <div className="flex flex-col gap-3 w-20 flex-shrink-0">
                                    {images.map((img, idx) => (
                                        <button
                                            key={img.id}
                                            onClick={() => setActiveImage(idx)}
                                            className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-primary shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                        >
                                            {img.url.toLowerCase().split('?')[0].match(/\.(mp4|mov|webm)$/) ? (
                                                <video src={img.url} className="w-full h-full object-cover" muted playsInline />
                                            ) : (
                                                <img src={img.url} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}
                            <div
                                className="relative flex-1 aspect-square overflow-hidden rounded-3xl bg-white shadow-2xl border border-primary/5 cursor-zoom-in"
                                onMouseMove={handleMouseMove}
                                onMouseEnter={() => setShowZoom(true)}
                                onMouseLeave={() => setShowZoom(false)}
                            >
                                {mainImage ? (
                                    mainImage.toLowerCase().split('?')[0].match(/\.(mp4|mov|webm)$/) ? (
                                        <video
                                            className="w-full h-full object-cover"
                                            src={mainImage}
                                            controls
                                            muted
                                            playsInline
                                        />
                                    ) : (
                                        <img
                                            src={mainImage}
                                            alt={product.name}
                                            className={`w-full h-full object-cover transition-transform duration-500 ${showZoom ? 'scale-[2.5]' : 'scale-100'}`}
                                            style={showZoom ? {
                                                transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`
                                            } : {}}
                                        />
                                    )
                                ) : (
                                    <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex flex-col items-center justify-center text-slate-400">
                                        <span className="material-symbols-outlined text-6xl mb-2 opacity-30">shopping_bag</span>
                                        <span className="text-sm font-medium uppercase tracking-widest opacity-50">Sem Foto</span>
                                    </div>
                                )}

                                {product.tag && (
                                    <div className="absolute top-4 left-4">
                                        <span className="rounded-full bg-primary px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg">
                                            {product.tag}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Product Info */}
                        <div className="flex flex-col">
                            {product.code && (
                                <p className="text-sm text-slate-400 font-medium mb-2">Código: {product.code}</p>
                            )}
                            <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4 leading-tight">
                                {product.name}
                            </h1>
                            <p className="text-3xl font-black text-primary mb-2">
                                R$ {product.price.toFixed(2)}
                            </p>
                            <div className="h-1 w-16 bg-primary/20 rounded-full mb-6" />

                            <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed mb-8 whitespace-pre-wrap">
                                {product.description}
                            </p>

                            {/* Quantity */}
                            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-5 mb-6 space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center border-2 border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors font-bold"
                                        >−</button>
                                        <input
                                            type="number"
                                            value={quantity}
                                            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                            className="w-20 text-center border-x-2 border-slate-200 dark:border-slate-700 py-3 font-bold bg-transparent focus:outline-none"
                                        />
                                        <button
                                            onClick={() => setQuantity(quantity + 1)}
                                            className="px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors font-bold"
                                        >+</button>
                                    </div>
                                    {product.production_time && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <span className="material-symbols-outlined text-green-500 text-sm">check_circle</span>
                                            <span className="font-bold text-green-600">{product.production_time}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-3">
                                <button
                                    onClick={handleAddToCart}
                                    className="w-full rounded-2xl bg-primary py-4 text-white font-black text-lg flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:bg-primary/90 hover:scale-[1.02] transition-all"
                                >
                                    <span className="material-symbols-outlined text-2xl">add_shopping_cart</span>
                                    Incluir no Orçamento
                                </button>

                                <button
                                    onClick={handleWhatsAppSingle}
                                    className="w-full rounded-2xl bg-green-500 py-4 text-white font-black text-lg flex items-center justify-center gap-3 shadow-xl shadow-green-500/20 hover:bg-green-600 hover:scale-[1.02] transition-all"
                                >
                                    <span className="material-symbols-outlined text-2xl">chat</span>
                                    Perguntar via WhatsApp
                                </button>
                            </div>

                            <p className="text-center text-sm text-slate-400 font-medium flex items-center justify-center gap-2 mt-4">
                                <span className="material-symbols-outlined text-sm">verified</span>
                                Qualidade e procedência garantida
                            </p>
                        </div>
                    </div>

                    {/* Related Products */}
                    {related.length > 0 && (
                        <section className="mt-24">
                            <div className="flex items-center justify-between mb-10">
                                <h2 className="text-3xl font-black text-slate-900 dark:text-white">Produtos Relacionados</h2>
                                <Link href="/" className="text-primary font-bold hover:underline flex items-center gap-1">
                                    Ver Todos
                                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                                </Link>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                                {related.map(p => (
                                    <ProductCard key={p.id} product={p} />
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
