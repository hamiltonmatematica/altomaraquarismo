'use client';

import Link from 'next/link';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { useQuoteCart } from '@/contexts/quote-cart-context';

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '553898416163';

export default function OrcamentoPage() {
    const { items, removeItem, updateQuantity, clearCart, total, getWhatsAppMessage, itemCount } = useQuoteCart();

    const sendWhatsApp = () => {
        const message = encodeURIComponent(getWhatsAppMessage());
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
    };

    return (
        <div className="relative flex min-h-screen flex-col">
            <Header />

            <main className="flex-1">
                <div className="mx-auto max-w-5xl px-6 py-12">
                    <div className="mb-10">
                        <div className="flex items-center gap-2 text-sm text-slate-400 mb-4">
                            <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">home</span>
                                Início
                            </Link>
                            <span className="material-symbols-outlined text-sm">chevron_right</span>
                            <span className="text-slate-700 dark:text-slate-200 font-semibold">Sacola de Orçamento</span>
                        </div>
                        <h1 className="text-4xl font-black mb-2">Sacola de Orçamento</h1>
                        <p className="text-slate-500 font-medium">{itemCount} {itemCount === 1 ? 'item' : 'itens'} selecionados</p>
                    </div>

                    {items.length === 0 ? (
                        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
                            <span className="material-symbols-outlined text-7xl text-slate-200 mb-6 block">shopping_bag</span>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Sua sacola está vazia</h2>
                            <p className="text-slate-500 mb-8">Adicione itens do catálogo para solicitar um orçamento</p>
                            <Link
                                href="/"
                                className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3 text-white font-bold hover:bg-primary/90 transition-all hover:scale-105"
                            >
                                <span className="material-symbols-outlined">storefront</span>
                                Explorar Catálogo
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-4">
                                {items.map((item) => {
                                    const img = item.product.images?.find(i => i.is_main)?.url || item.product.images?.[0]?.url || '';
                                    return (
                                        <div key={item.product.id} className="flex gap-6 bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 transition-all hover:shadow-lg">
                                            <Link href={`/produto/${item.product.slug}`} className="w-28 h-28 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                                                <img src={img} alt={item.product.name} className="w-full h-full object-cover hover:scale-110 transition-transform" />
                                            </Link>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div>
                                                        <Link href={`/produto/${item.product.slug}`}>
                                                            <h3 className="font-bold text-lg hover:text-primary transition-colors">{item.product.name}</h3>
                                                        </Link>
                                                        {item.product.code && <p className="text-xs text-slate-400 mt-0.5">Código: {item.product.code}</p>}
                                                    </div>
                                                    <button
                                                        onClick={() => removeItem(item.product.id)}
                                                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-all flex-shrink-0"
                                                    >
                                                        <span className="material-symbols-outlined">delete</span>
                                                    </button>
                                                </div>

                                                <div className="flex items-center justify-between mt-4">
                                                    <div className="flex items-center border-2 border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                                                        <button
                                                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                                            className="px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors font-bold text-sm"
                                                        >−</button>
                                                        <span className="px-4 py-1.5 text-sm font-bold border-x-2 border-slate-200 dark:border-slate-700">{item.quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                                            className="px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors font-bold text-sm"
                                                        >+</button>
                                                    </div>
                                                    <p className="text-lg font-black text-primary">
                                                        R$ {(item.product.price * item.quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="lg:col-span-1">
                                <div className="sticky top-24 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-6">
                                    <h3 className="font-black text-lg">Resumo do Orçamento</h3>

                                    <div className="space-y-3 text-sm">
                                        {items.map(item => (
                                            <div key={item.product.id} className="flex justify-between">
                                                <span className="text-slate-500 truncate mr-2">{item.product.name} × {item.quantity}</span>
                                                <span className="font-bold flex-shrink-0">R$ {(item.product.price * item.quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="border-t border-slate-200 dark:border-slate-800 pt-4">
                                        <div className="flex items-center justify-between">
                                            <span className="font-bold text-lg">Total estimado:</span>
                                            <span className="text-2xl font-black text-primary">R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={sendWhatsApp}
                                        className="w-full rounded-2xl bg-green-500 py-4 text-white font-black text-base flex items-center justify-center gap-3 shadow-xl shadow-green-500/20 hover:bg-green-600 hover:scale-[1.02] transition-all"
                                    >
                                        <span className="material-symbols-outlined text-xl">chat</span>
                                        Enviar Orçamento via WhatsApp
                                    </button>

                                    <button
                                        onClick={clearCart}
                                        className="w-full rounded-xl border-2 border-red-200 text-red-500 py-3 font-bold text-sm hover:bg-red-50 dark:hover:bg-red-950/30 transition-all"
                                    >
                                        Limpar Sacola
                                    </button>

                                    <p className="text-center text-xs text-slate-400 flex items-center justify-center gap-1">
                                        <span className="material-symbols-outlined text-xs">info</span>
                                        Valores sujeitos a confirmação
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
