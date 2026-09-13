import { useState, useEffect, useCallback, useMemo } from 'react';

export interface CartItem {
    id: number;
    nama: string;
    Varian: string;
    Harga: number;
    Foto: string | null;
    quantity: number;
    /**
     * Key unik per kombinasi produk + varian (ukuran). Dipakai untuk
     * mencocokkan/menghapus/update item di cart, BUKAN `id` saja —
     * karena satu produk bisa punya beberapa ukuran (50ml, 75ml, dst)
     * yang harus dianggap baris terpisah di keranjang.
     */
    cartKey: string;
}

const CART_KEY = 'perfume_cart';
const CART_EVENT = 'cart-updated';

function makeCartKey(id: number, Varian: string): string {
    return `${id}-${Varian}`;
}

function readCart(): CartItem[] {
    if (typeof window === 'undefined') return [];
    try {
        const raw = localStorage.getItem(CART_KEY);
        const parsed: CartItem[] = raw ? JSON.parse(raw) : [];

        // Backward-compat: data cart lama (sebelum ada field cartKey) di-backfill
        // di sini biar gak hilang / gak error pas dibaca ulang.
        return parsed.map((item) => ({
            ...item,
            cartKey: item.cartKey ?? makeCartKey(item.id, item.Varian),
        }));
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

    const addToCart = useCallback((product: Omit<CartItem, 'quantity' | 'cartKey'>, qty: number = 1) => {
        const current = readCart();

        const safeProduct = {
            ...product,
            Harga: Number(product.Harga) || 0,
        };

        // Vite pake import.meta.env, bukan process.env (yang itu punya Node.js)
        if (import.meta.env.DEV && safeProduct.Harga === 0) {
            console.warn('[useCart] addToCart dipanggil dengan Harga 0/invalid untuk produk:', product);
        }

        const cartKey = makeCartKey(safeProduct.id, safeProduct.Varian);
        const existingIndex = current.findIndex((item) => item.cartKey === cartKey);

        if (existingIndex !== -1) {
            // Item + varian yang sama persis sudah ada -> tinggal tambah quantity-nya.
            // Harga & data lain ikut di-refresh dari produk yang baru di-add, jaga-jaga
            // kalau ada perubahan harga (misal promo) sejak item lama ditambahkan.
            current[existingIndex] = {
                ...current[existingIndex],
                ...safeProduct,
                cartKey,
                quantity: current[existingIndex].quantity + qty,
            };
        } else {
            current.push({ ...safeProduct, cartKey, quantity: qty });
        }

        writeCart(current);
    }, []);

    const updateQuantity = useCallback((cartKey: string, qty: number) => {
        const current = readCart();
        const index = current.findIndex((item) => item.cartKey === cartKey);

        if (index === -1) return;

        const updated = qty <= 0
            ? current.filter((item) => item.cartKey !== cartKey)
            : current.map((item) => (item.cartKey === cartKey ? { ...item, quantity: qty } : item));

        writeCart(updated);
    }, []);

    const removeFromCart = useCallback((cartKey: string) => {
        const current = readCart();
        writeCart(current.filter((item) => item.cartKey !== cartKey));
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
