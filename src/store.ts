import { create } from 'zustand';
import { NFT, Order } from './types';
import { v4 as uuidv4 } from 'uuid';

interface StoreState {
  nfts: NFT[];
  orders: Order[];
  pendingBurn: number;
  burnedAmount: number;
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  addNFT: (nft: Omit<NFT, 'id' | 'soldCount'>) => void;
  updateNFT: (id: string, updates: Partial<NFT>) => void;
  deleteNFT: (id: string) => void;
  addOrder: (order: Omit<Order, 'id'>) => void;
  updateOrder: (id: string, updates: Partial<Order>) => void;
  updatePendingBurn: (amount: number) => void;
  updateBurnedAmount: (amount: number) => void;
  loadInitialData: () => Promise<void>;
  saveData: () => Promise<void>;
  formatPrice: (price: number) => string;
}

export const useStore = create<StoreState>((set, get) => ({
  nfts: [],
  orders: [],
  pendingBurn: 0,
  burnedAmount: 0,
  isAuthenticated: false,
  login: (username, password) => {
    // Basic authentication check
    if (username === 'PlanC' && password === 'Ceyhun8387@') {
      set({ isAuthenticated: true });
      return true;
    }
    return false;
  },
  logout: () => set({ isAuthenticated: false }),
  addNFT: (nft) => {
    const newNFT: NFT = { id: uuidv4(), soldCount: 0, ...nft };
    set((state) => ({ nfts: [...state.nfts, newNFT] }));
    // After updating state
    useStore.getState().saveData();
  },
  updateNFT: (id, updates) => {
    set((state) => ({
      nfts: state.nfts.map((nft) => (nft.id === id ? { ...nft, ...updates } : nft)),
    }));
    // After updating state
    useStore.getState().saveData();
  },
  deleteNFT: (id) => {
    set((state) => ({ nfts: state.nfts.filter((nft) => nft.id !== id) }));
    useStore.getState().saveData();
  },
  addOrder: (order) => {
    const newOrder: Order = { id: uuidv4(), ...order };
    set((state) => ({ orders: [...state.orders, newOrder] }));
    useStore.getState().saveData();
  },
  updateOrder: (id, updates) => {
    set((state) => ({
      orders: state.orders.map((order) => (order.id === id ? { ...order, ...updates } : order)),
    }));
    useStore.getState().saveData();
  },
  updatePendingBurn: (amount) => {
    set((state) => ({ pendingBurn: state.pendingBurn + amount }));
    useStore.getState().saveData();
  },
  updateBurnedAmount: (amount) => {
    set({ burnedAmount: amount });
    useStore.getState().saveData();
  },
  loadInitialData: async () => {
    try {
      const [nftResponse, ordersResponse, settingsResponse] = await Promise.all([
        fetch('/data/nft.json'),
        fetch('/data/orders.json'),
        fetch('/data/settings.json'),
      ]);

      const nftData = await nftResponse.json();
      const ordersData = await ordersResponse.json();
      const settingsData = await settingsResponse.json();

      set({
        nfts: nftData.nfts || [],
        orders: ordersData.orders || [],
        pendingBurn: settingsData.burn?.pending || 0,
        burnedAmount: settingsData.burn?.total || 0,
      });
    } catch (error) {
      console.error('Failed to initialize data:', error);
    }
  },
  saveData: async () => {
    try {
      const nfts = get().nfts;
      const orders = get().orders;
      const pendingBurn = get().pendingBurn;
      const burnedAmount = get().burnedAmount;

      // Save NFTs
      await fetch('/data/nft.json', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nfts }),
      });

      // Save orders
      await fetch('/data/orders.json', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orders }),
      });

      // Save settings (burn data)
      await fetch('/data/settings.json', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ burn: { pending: pendingBurn, total: burnedAmount } }),
      });
    } catch (error) {
      console.error('Failed to save data:', error);
    }
  },
  formatPrice: (price: number) => {
    return price.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  },
}));
