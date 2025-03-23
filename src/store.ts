import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { NFT, Order } from './types';
import { v4 as uuidv4 } from 'uuid';

interface StoreState {
  nfts: NFT[];
  orders: Order[];
  isAuthenticated: boolean;
  pendingBurn: number;
  burnedAmount: number;
  lastOrderId: number;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  addNFT: (nft: Omit<NFT, 'id' | 'soldCount'>) => void;
  buyNFT: (nftId: string, quantity: number, customer: string, walletAddress: string) => void;
  updateOrder: (orderId: string, updates: Partial<Order>) => void;
  addOrder: (order: Omit<Order, 'id' | 'status'>) => void;
  incrementSoldCount: (nftId: string) => void;
  updateNFT: (nftId: string, updates: Partial<NFT>) => void;
  deleteNFT: (nftId: string) => void;
  updateAllNFTPrices: (newPrice: number) => void;
  formatPrice: (price: number) => string;
  updateBurnedAmount: (amount: number) => void;
  updatePendingBurn: (amount: number) => void;
  loadInitialData: () => Promise<void>;
}

// Helper function to save NFTs to JSON file
const saveNFTsToFile = async (nfts: NFT[]) => {
  try {
    const response = await fetch('/data/nft.json', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nfts }, null, 2),
    });
    if (!response.ok) {
      throw new Error('Failed to save NFTs');
    }
  } catch (error) {
    console.error('Error saving NFTs:', error);
  }
};

// Helper function to save orders to JSON file
const saveOrdersToFile = async (orders: Order[]) => {
  try {
    const response = await fetch('/data/orders.json', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ orders }, null, 2),
    });
    if (!response.ok) {
      throw new Error('Failed to save orders');
    }
  } catch (error) {
    console.error('Error saving orders:', error);
  }
};

// Helper function to save settings to JSON file
const saveSettingsToFile = async (pendingBurn: number, burnedAmount: number, lastOrderId: number) => {
  try {
    const response = await fetch('/data/settings.json', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        admin: {
          username: 'PlanC',
          password: 'Memex2025@@'
        },
        burn: {
          pending: pendingBurn,
          total: burnedAmount
        },
        lastOrderId: lastOrderId
      }, null, 2),
    });
    if (!response.ok) {
      throw new Error('Failed to save settings data');
    }
  } catch (error) {
    console.error('Error saving settings data:', error);
  }
};

const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      nfts: [],
      orders: [],
      isAuthenticated: false,
      pendingBurn: 0,
      burnedAmount: 0,
      lastOrderId: 0,

      loadInitialData: async () => {
        try {
          const [nftResponse, ordersResponse, settingsResponse] = await Promise.all([
            fetch('/data/nft.json'),
            fetch('/data/orders.json'),
            fetch('/data/settings.json')
          ]);

          if (!nftResponse.ok || !ordersResponse.ok || !settingsResponse.ok) {
            throw new Error('Failed to load data');
          }

          const nftData = await nftResponse.json();
          const ordersData = await ordersResponse.json();
          const settingsData = await settingsResponse.json();

          set({ 
            nfts: nftData.nfts,
            orders: ordersData.orders,
            pendingBurn: settingsData.burn.pending,
            burnedAmount: settingsData.burn.total,
            lastOrderId: settingsData.lastOrderId || 0,
          });
        } catch (error) {
          console.error('Error loading initial data:', error);
        }
      },

      login: (username, password) => {
        if (username === 'PlanC' && password === 'Ceyhun8387@') {
          set({ isAuthenticated: true });
          return true;
        }
        return false;
      },

      logout: () => set({ isAuthenticated: false }),

      addNFT: async (nft) => {
        const newNFT: NFT = {
          id: uuidv4(),
          ...nft,
          soldCount: 0,
        };
        set((state) => {
          const newNFTs = [...state.nfts, newNFT];
          saveNFTsToFile(newNFTs);
          return { nfts: newNFTs };
        });
      },

      buyNFT: async (nftId: string, quantity: number, customer: string, walletAddress) => {
        set((state) => {
          const nft = state.nfts.find((nft) => nft.id === nftId);
          if (!nft) {
            console.log('NFT not found');
            return state;
          }

          if (nft.mintCount <= nft.soldCount) {
            console.log('NFT sold out');
            return state;
          }

          const availableQuantity = Math.min(quantity, nft.mintCount - nft.soldCount);
          const newOrderId = String(state.lastOrderId + 1).padStart(5, '0');

          const newOrder: Order = {
            id: newOrderId,
            nftTitle: nft.title,
            customer,
            walletAddress,
            purchaseDate: new Date().toLocaleDateString(),
            status: 'pending payment',
            nftId: nftId,
          };

          const updatedNFTs = state.nfts.map((n) =>
            n.id === nftId ? { ...n, soldCount: n.soldCount + availableQuantity } : n
          );

          const updatedOrders = [...state.orders, newOrder];

          // Save all changes to files
          saveNFTsToFile(updatedNFTs);
          saveOrdersToFile(updatedOrders);
          saveSettingsToFile(state.pendingBurn, state.burnedAmount, state.lastOrderId + 1);

          return {
            nfts: updatedNFTs,
            orders: updatedOrders,
            lastOrderId: state.lastOrderId + 1
          };
        });
      },

      updateOrder: async (orderId, updates) => {
        set(async (state) => {
          let updatedNFTs = [...state.nfts];
          let updatedOrders = state.orders.map((order) => {
            if (order.id === orderId) {
              const nft = state.nfts.find((nft) => nft.id === order.nftId);
              if (nft) {
                // If the status is being updated to 'canceled', decrement the soldCount
                if (updates.status === 'canceled' && order.status !== 'canceled') {
                  updatedNFTs = updatedNFTs.map((n) => {
                    if (n.id === order.nftId) {
                      return { ...n, soldCount: Math.max(0, n.soldCount - 1) };
                    }
                    return n;
                  });
                }
              }
              return { ...order, ...updates };
            }
            return order;
          });
      
          try {
            await saveNFTsToFile(updatedNFTs);
            await saveOrdersToFile(updatedOrders);
          } catch (error) {
            console.error("Error saving data:", error);
          }
      
          return { nfts: updatedNFTs, orders: updatedOrders };
        });
      },

      addOrder: async (order) => {
        set((state) => {
          const newOrderId = String(state.lastOrderId + 1).padStart(5, '0');
          const newOrder = { ...order, id: newOrderId, status: 'pending payment' };
          const updatedOrders = [...state.orders, newOrder];
          
          saveOrdersToFile(updatedOrders);
          saveSettingsToFile(state.pendingBurn, state.burnedAmount, state.lastOrderId + 1);
          
          return {
            orders: updatedOrders,
            lastOrderId: state.lastOrderId + 1
          };
        });
      },

      incrementSoldCount: async (nftId) => {
        set((state) => {
          const updatedNFTs = state.nfts.map((nft) =>
            nft.id === nftId ? { ...nft, soldCount: nft.soldCount + 1 } : nft
          );
          saveNFTsToFile(updatedNFTs);
          return { nfts: updatedNFTs };
        });
      },

      updateNFT: async (nftId, updates) => {
        set((state) => {
          const updatedNFTs = state.nfts.map((nft) => 
            nft.id === nftId ? { ...nft, ...updates } : nft
          );
          saveNFTsToFile(updatedNFTs);
          return { nfts: updatedNFTs };
        });
      },

      deleteNFT: async (nftId: string) => {
        set((state) => {
          const updatedNFTs = state.nfts.filter((nft) => nft.id !== nftId);
          saveNFTsToFile(updatedNFTs);
          return { nfts: updatedNFTs };
        });
      },

      updateAllNFTPrices: async (newPrice: number) => {
        set((state) => {
          const updatedNFTs = state.nfts.map((nft) => ({ ...nft, price: newPrice }));
          saveNFTsToFile(updatedNFTs);
          return { nfts: updatedNFTs };
        });
      },

      formatPrice: (price: number) => {
        return price.toLocaleString('tr-TR');
      },

      updateBurnedAmount: (amount: number) => {
        set((state) => {
          const newBurnedAmount = amount;
          saveSettingsToFile(state.pendingBurn, newBurnedAmount, get().lastOrderId);
          return { burnedAmount: newBurnedAmount };
        });
      },

      updatePendingBurn: (amount: number) => {
        set((state) => {
          const newPendingBurn = state.pendingBurn + amount;
          saveSettingsToFile(newPendingBurn, state.burnedAmount, get().lastOrderId);
          return { pendingBurn: newPendingBurn };
        });
      },
    }),
    {
      name: 'nft-storage',
      storage: localStorage,
    }
  )
);

export { useStore };
