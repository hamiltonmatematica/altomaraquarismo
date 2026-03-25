'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product, QuoteCartItem } from '@/types/database';

interface QuoteCartContextType {
    items: QuoteCartItem[];
    addItem: (product: Product, quantity?: number) => void;
    removeItem: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    itemCount: number;
    total: number;
    getWhatsAppMessage: () => string;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

const QuoteCartContext = createContext<QuoteCartContextType | undefined>(undefined);

const STORAGE_KEY = 'alto-mar-quote-cart';

export function QuoteCartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<QuoteCartItem[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) setItems(JSON.parse(stored));
        } catch { }
    }, []);

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        } catch { }
    }, [items]);

    const addItem = useCallback((product: Product, quantity?: number) => {
        const qty = quantity || product.min_quantity || 1;
        setItems(prev => {
            const existing = prev.find(item => item.product.id === product.id);
            if (existing) {
                return prev.map(item =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity + qty }
                        : item
                );
            }
            return [...prev, { product, quantity: qty }];
        });
        setIsOpen(true);
    }, []);

    const removeItem = useCallback((productId: string) => {
        setItems(prev => prev.filter(item => item.product.id !== productId));
    }, []);

    const updateQuantity = useCallback((productId: string, quantity: number) => {
        if (quantity <= 0) {
            removeItem(productId);
            return;
        }
        setItems(prev =>
            prev.map(item =>
                item.product.id === productId ? { ...item, quantity } : item
            )
        );
    }, [removeItem]);

    const clearCart = useCallback(() => {
        setItems([]);
        setIsOpen(false);
    }, []);

    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    const getWhatsAppMessage = useCallback(() => {
        if (items.length === 0) return '';
        let msg = `Olá! Gostaria de solicitar um orçamento para os seguintes itens:\n\n`;
        items.forEach((item, idx) => {
            msg += `${idx + 1}. *${item.product.name}*\n`;
            if (item.product.code) msg += `   Código: ${item.product.code}\n`;
            msg += `   Quantidade: ${item.quantity}\n`;
            msg += `   Valor unitário: R$ ${item.product.price.toFixed(2)}\n\n`;
        });
        msg += `*Total estimado: R$ ${total.toFixed(2)}*\n\n`;
        msg += `Aguardo o retorno. Obrigado(a)!`;
        return msg;
    }, [items, total]);

    return (
        <QuoteCartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, itemCount, total, getWhatsAppMessage, isOpen, setIsOpen }}>
            {children}
        </QuoteCartContext.Provider>
    );
}

export function useQuoteCart() {
    const ctx = useContext(QuoteCartContext);
    if (!ctx) throw new Error('useQuoteCart must be used within QuoteCartProvider');
    return ctx;
}
