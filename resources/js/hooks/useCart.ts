import { useState, useEffect } from 'react';

export interface CartItem {
    id: number;
    nama: string;
    Varian: string;
    Harga: number;
    Foto: string | null;
    quantity: number;
}

export const useCart = () => {
    const [cart, setCart] = useState<CartItem[]>([]);

    const loadCart = () => {
        const savedCart = localStorage.getItem('perfume_cart');
        if (savedCart) {
            setCart(JSON.parse(savedCart));
        }
    };

    useEffect(() => {
        // Load pertama kali
        loadCart();
        // Listener jika ada perubahan keranjang dari komponen lain
        window.addEventListener('cart-updated', loadCart);
        return () => window.removeEventListener('cart-updated', loadCart);
    }, []);

    const addToCart = (product: Omit<CartItem, 'quantity'>, qty: number = 1) => {
        const savedCart = JSON.parse(localStorage.getItem('perfume_cart') || '[]');
        const existingItem = savedCart.find((item: CartItem) => item.id === product.id);

        if (existingItem) {
            existingItem.quantity += qty;
        } else {
            savedCart.push({ ...product, quantity: qty });
        }

        localStorage.setItem('perfume_cart', JSON.stringify(savedCart));
        window.dispatchEvent(new Event('cart-updated')); // Trigger update Navbar
    };

    const updateQuantity = (id: number, qty: number) => {
        let savedCart = JSON.parse(localStorage.getItem('perfume_cart') || '[]');
        const index = savedCart.findIndex((item: CartItem) => item.id === id);
        
        if (index !== -1) {
            if (qty <= 0) {
                savedCart.splice(index, 1); // Hapus jika qty 0
            } else {
                savedCart[index].quantity = qty;
            }
            localStorage.setItem('perfume_cart', JSON.stringify(savedCart));
            window.dispatchEvent(new Event('cart-updated'));
        }
    };

    const removeFromCart = (id: number) => {
        const savedCart = JSON.parse(localStorage.getItem('perfume_cart') || '[]');
        const updated = savedCart.filter((item: CartItem) => item.id !== id);
        localStorage.setItem('perfume_cart', JSON.stringify(updated));
        window.dispatchEvent(new Event('cart-updated'));
    };

    const clearCart = () => {
        localStorage.removeItem('perfume_cart');
        window.dispatchEvent(new Event('cart-updated'));
    };

    // Hitung total item dan total harga
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    const totalPrice = cart.reduce((total, item) => total + (item.Harga * item.quantity), 0);

    return { cart, addToCart, updateQuantity, removeFromCart, clearCart, totalItems, totalPrice };
};