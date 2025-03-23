import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { NFT, Order } from './types';
import nftData from '../public/data/nft.json';
import ordersData from '../public/data/orders.json';

interface StoreState {
  nfts: NFT[];
  orders: Order[];
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  addOrder: (order: Order) => void;
  cancelOrder: (orderId: string) => void;
  incrementSoldCount: (nftId: string) => void;
  remintNFT: (nftId: string) => void;
  formatPrice: (price: number) => string;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      nfts: nftData.nfts,
      orders: ordersData.orders,
      isAuthenticated: false,
      login: () => set({ isAuthenticated: true }),
      logout: () => set({ isAuthenticated: false }),
      addOrder: (order: Order) => {
        set((state) => ({ orders: [...state.orders, order] }));
      },
      cancelOrder: (orderId: string) => {
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === orderId ? { ...order, status: 'cancelled' } : order
          ),
        }));
      },
      remintNFT: (nftId: string) => {
        set((state) => ({
          nfts: state.nfts.map((nft) =>
            nft.id === nftId ? { ...nft, soldCount: Math.max(0, nft.soldCount - 1) } : nft
          ),
        }));
      },
      incrementSoldCount: (nftId: string) => {
        set((state) => ({
          nfts: state.nfts.map((nft) =>
            nft.id === nftId ? { ...nft, soldCount: nft.soldCount + 1 } : nft
          ),
        }));
      },
      formatPrice: (price: number) => {
        return price.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      },
    }),
    {
      name: 'memex-nft-store',
    }
  )
);
