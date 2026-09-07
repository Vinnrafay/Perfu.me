import { useState, useEffect, useCallback, useMemo } from 'react';

export interface CartItem {
    id: number;
    nama: string;
    Varian: string;
    Harga: number;
    Foto: string | null;
    quantity: number;
}

const CART_KEY = 'perfume_cart';
const CART_EVENT = 'cart-updated';

function readCart(): CartItem[] {
    if (typeof window === 'undefined') return [];
    try {
        const raw = localStorage.getItem(CART_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function writeCart(cart: CartItem[]) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    window.dispatchEvent(new Event(CART_EVENT));
}

export const useCart = () => {
    const [cart, setCart] = useState<CartItem[]>([]);

    const loadCart = useCallback(() => {
        setCart(readCart());
    }, []);

    useEffect(() => {
        loadCart();
        window.addEventListener(CART_EVENT, loadCart);
        window.addEventListener('storage', loadCart);
        return () => {
            window.removeEventListener(CART_EVENT, loadCart);
            window.removeEventListener('storage', loadCart);
        };
    }, [loadCart]);

    const addToCart = useCallback((product: Omit<CartItem, 'quantity'>, qty: number = 1) => {
        const current = readCart();
        const existingIndex = current.findIndex((item) => item.id === product.id);

        const safeProduct = {
            ...product,
            Harga: Number(product.Harga) || 0,
        };

        // Vite pake import.meta.env, bukan process.env (yang itu punya Node.js)
        if (import.meta.env.DEV && safeProduct.Harga === 0) {
            console.warn('[useCart] addToCart dipanggil dengan Harga 0/invalid untuk produk:', product);
        }

        if (existingIndex !== -1) {
            current[existingIndex] = {
                ...current[existingIndex],
                quantity: current[existingIndex].quantity + qty,
            };
        } else {
            current.push({ ...safeProduct, quantity: qty });
        }

        writeCart(current);
    }, []);

    const updateQuantity = useCallback((id: number, qty: number) => {
        const current = readCart();
        const index = current.findIndex((item) => item.id === id);

        if (index === -1) return;

        const updated = qty <= 0
            ? current.filter((item) => item.id !== id)
            : current.map((item) => (item.id === id ? { ...item, quantity: qty } : item));

        writeCart(updated);
    }, []);

    const removeFromCart = useCallback((id: number) => {
        const current = readCart();
        writeCart(current.filter((item) => item.id !== id));
    }, []);

    const clearCart = useCallback(() => {
        if (typeof window === 'undefined') return;
        localStorage.removeItem(CART_KEY);
        window.dispatchEvent(new Event(CART_EVENT));
    }, []);

    const totalItems = useMemo(
        () => cart.reduce((total, item) => total + item.quantity, 0),
        [cart]
    );

    const totalPrice = useMemo(
        () => cart.reduce((total, item) => total + item.Harga * item.quantity, 0),
        [cart]
    );

    return { cart, addToCart, updateQuantity, removeFromCart, clearCart, totalItems, totalPrice };
};