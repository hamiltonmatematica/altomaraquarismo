'use client';

import { useQuoteCart } from '@/contexts/quote-cart-context';
import Link from 'next/link';

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5500000000000';

export default function QuoteCartDrawer() {
    const { items, removeItem, updateQuantity, clearCart, itemCount, total, getWhatsAppMessage, isOpen, setIsOpen } = useQuoteCart();

    if (!isOpen) return null;

    const sendWhatsApp = () => {
        const message = encodeURIComponent(getWhatsAppMessage());
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
    };

    return (
        <>
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" onClick={() => setIsOpen(false)} />

            <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
                <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary text-2xl">shopping_bag</span>
                        <h2 className="text-xl font-black">Sacola de Orçamento</h2>
                        <span className="bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full">{itemCount}</span>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {items.length === 0 ? (
                        <div className="text-center py-12">
                            <span className="material-symbols-outlined text-6xl text-slate-300 mb-4 block">shopping_bag</span>
                            <p className="text-slate-500 font-medium">Sua sacola está vazia</p>
                            <p className="text-sm text-slate-400 mt-1">Adicione itens para solicitar um orçamento</p>
                        </div>
                    ) : (
                        items.map((item) => {
                            const img = item.product.images?.find(i => i.is_main)?.url || item.product.images?.[0]?.url || '';
                            return (
                                <div key={item.product.id} className="flex gap-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4">
                                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-white flex-shrink-0">
                                        <img src={img} alt={item.product.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-sm truncate">{item.product.name}</h4>
                                        {item.product.code && <p className="text-xs text-slate-400">{item.product.code}</p>}
                                        <p className="text-primary font-black text-sm mt-1">R$ {item.product.price.toFixed(2)}</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <button
                                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                                className="w-7 h-7 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center text-sm hover:bg-primary hover:text-white hover:border-primary transition-all"
                                            >−</button>
                                            <span className="text-sm font-bold w-8 text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                                className="w-7 h-7 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center text-sm hover:bg-primary hover:text-white hover:border-primary transition-all"
                                            >+</button>
                                            <button
                                                onClick={() => removeItem(item.product.id)}
                                                className="ml-auto p-1 text-red-400 hover:text-red-600 transition-colors"
                                            >
                                                <span className="material-symbols-outlined text-lg">delete</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {items.length > 0 && (
                    <div className="p-6 border-t border-slate-200 dark:border-slate-800 space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-slate-500 font-medium">Total estimado:</span>
                            <span className="text-2xl font-black text-primary">R$ {total.toFixed(2)}</span>
                        </div>

                        <button
                            onClick={sendWhatsApp}
                            className="w-full rounded-2xl bg-green-500 py-4 text-white font-black text-lg flex items-center justify-center gap-3 shadow-xl shadow-green-500/20 hover:bg-green-600 hover:scale-[1.02] transition-all"
                        >
                            <span className="material-symbols-outlined text-2xl">chat</span>
                            Enviar Orçamento via WhatsApp
                        </button>

                        <div className="flex gap-3">
                            <Link
                                href="/orcamento"
                                onClick={() => setIsOpen(false)}
                                className="flex-1 rounded-xl border-2 border-slate-200 dark:border-slate-700 py-3 text-center font-bold text-sm hover:border-primary hover:text-primary transition-all"
                            >
                                Ver Detalhes
                            </Link>
                            <button
                                onClick={clearCart}
                                className="rounded-xl border-2 border-red-200 text-red-500 px-4 py-3 font-bold text-sm hover:bg-red-50 transition-all"
                            >
                                Limpar
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
