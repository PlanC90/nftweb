import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from './supabaseClient';
import { NFT, Order } from './types';

interface StoreState {
  nfts: NFT[];
  orders: Order[];
  pendingBurn: number;
  burnedAmount: number;
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  addNFT: (nft: Omit<NFT, 'id' | 'soldCount'>) => Promise<void>;
  updateNFT: (id: string, updates: Partial<NFT>) => Promise<void>;
  deleteNFT: (id: string) => Promise<void>;
  addOrder: (order: Omit<Order, 'id'>) => Promise<void>;
  updateOrder: (id: string, updates: Partial<Order>) => Promise<void>;
  updatePendingBurn: (amount: number) => void;
  updateBurnedAmount: (amount: number) => void;
  loadInitialData: () => Promise<void>;
  formatPrice: (price: number) => string;
}

export const useStore = create<StoreState>((set) => ({
  nfts: [],
  orders: [],
  pendingBurn: 0,
  burnedAmount: 0,
  isAuthenticated: false,

  login: (username, password) => {
    if (username === 'PlanC' && password === 'Ceyhun8387@') {
      set({ isAuthenticated: true });
      return true;
    }
    return false;
  },

  logout: () => set({ isAuthenticated: false }),

  addNFT: async (nft) => {
    const newNFT: NFT = { id: uuidv4(), soldCount: 0, ...nft };
    const { error } = await supabase.from('nfts').insert([newNFT]);
    if (error) return console.error('❌ NFT eklenemedi:', error.message);
    set((state) => ({ nfts: [...state.nfts, newNFT] }));
  },

  updateNFT: async (id, updates) => {
    const { error } = await supabase.from('nfts').update(updates).eq('id', id);
    if (error) return console.error('❌ NFT güncellenemedi:', error.message);
    set((state) => ({
      nfts: state.nfts.map((nft) => (nft.id === id ? { ...nft, ...updates } : nft)),
    }));
  },

  deleteNFT: async (id) => {
    const { error } = await supabase.from('nfts').delete().eq('id', id);
    if (error) return console.error('❌ NFT silinemedi:', error.message);
    set((state) => ({ nfts: state.nfts.filter((nft) => nft.id !== id) }));
  },

  addOrder: async (order) => {
    const newOrder: Order = { id: uuidv4(), ...order };
    const nftId = order.nftId;

    const { data: nft } = await supabase
        .from('nfts')
        .select('soldCount, mintCount')
        .eq('id', nftId)
        .single();

    if (!nft) return console.error('❌ NFT bulunamadı');
    if (nft.soldCount >= nft.mintCount) {
      alert("❌ This NFT is sold out!");
      return;
    }

    const { error: orderError } = await supabase.from('orders').insert([newOrder]);
    if (orderError) return console.error('❌ Order eklenemedi:', orderError.message);

    const updatedCount = nft.soldCount + 1;
    const { error: nftError } = await supabase.from('nfts').update({ soldCount: updatedCount }).eq('id', nftId);
    if (nftError) return console.error('❌ soldCount güncellenemedi:', nftError.message);

    set((state) => ({
      orders: [...state.orders, newOrder],
      nfts: state.nfts.map((nft) =>
          nft.id === nftId ? { ...nft, soldCount: updatedCount } : nft
      ),
    }));
  },

  updateOrder: async (id, updates) => {
    const { error } = await supabase.from('orders').update(updates).eq('id', id);
    if (error) return console.error('❌ Order güncellenemedi:', error.message);
    set((state) => ({
      orders: state.orders.map((order) => (order.id === id ? { ...order, ...updates } : order)),
    }));
  },

  updatePendingBurn: (amount) => {
    set((state) => ({ pendingBurn: state.pendingBurn + amount }));
  },

  updateBurnedAmount: (amount) => {
    set({ burnedAmount: amount });
  },

  loadInitialData: async () => {
    try {
      const { data: nftData } = await supabase.from('nfts').select('*');
      const { data: orderData } = await supabase.from('orders').select('*');

      set({
        nfts: nftData || [],
        orders: orderData || [],
        pendingBurn: 0,
        burnedAmount: 0,
      });
    } catch (error) {
      console.error('❌ Veriler alınamadı:', error);
    }
  },

  formatPrice: (price: number) => {
    return price.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  },
}));
