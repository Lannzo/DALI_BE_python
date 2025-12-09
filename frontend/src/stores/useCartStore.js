import { create } from 'zustand';
import api from '../lib/api';

const useCartStore = create((set, get) => ({
  cart: null,
  isLoading: false,

  fetchCart: async () => {
    try {
      set({ isLoading: true });
      const response = await api.get('/cart');
      set({ cart: response.data, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  addToCart: async (productId, quantity = 1) => {
    await api.post('/cart/items', { product_id: productId, quantity });
    await get().fetchCart();
  },

  updateQuantity: async (productId, quantity) => {
    await api.put(`/cart/items/${productId}?quantity=${quantity}`);
    await get().fetchCart();
  },

  removeItem: async (productId) => {
    await api.delete(`/cart/items/${productId}`);
    await get().fetchCart();
  },

  clearCart: async () => {
    await api.delete('/cart');
    set({ cart: null });
  },
}));

export default useCartStore;
