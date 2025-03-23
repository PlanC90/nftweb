import { create } from 'zustand';
import { AdminState, NFT, Order, Settings } from './src/types';
import nftData from './public/data/nft.json';
import ordersData from './public/data/orders.json';
import settingsData from './public/data/settings.json';

interface StoreState {
  nftList: NFT[];
  orders: Order[];
  settings: Settings;
  admin: AdminState;
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  addNft: (nft: NFT) => void;
  updateNft: (updatedNft: NFT) => void;
  deleteNft: (id: number) => void;
  addOrder: (order: Order) => void;
  updateOrder: (updatedOrder: Order) => void;
  deleteOrder: (id: number) => void;
  updateSettings: (newSettings: Settings) => void;
  connectWebSocket: () => void;
}

export const useStore = create<StoreState>((set, get) => ({
  nftList: nftData,
  orders: ordersData,
  settings: settingsData,
  admin: {
    username: settingsData.admin.username,
    password: settingsData.admin.password,
  },
  isAuthenticated: false,
  login: (username, password) => {
    console.log('Attempting to login with:', username, password);
    console.log('Stored credentials:', get().admin.username, get().admin.password);
    if (username === get().admin.username && password === get().admin.password) {
      set({ isAuthenticated: true });
      return true;
    } else {
      return false;
    }
  },
  logout: () => set({ isAuthenticated: false }),
  addNft: (nft) => {
    set((state) => ({ nftList: [...state.nftList, nft] }));
  },
  updateNft: (updatedNft) => {
    set((state) => ({
      nftList: state.nftList.map((nft) =>
        nft.id === updatedNft.id ? updatedNft : nft
      ),
    }));
  },
  deleteNft: (id) => {
    set((state) => ({
      nftList: state.nftList.filter((nft) => nft.id !== id),
    }));
  },
  addOrder: (order) => {
    set((state) => ({ orders: [...state.orders, order] }));
  },
  updateOrder: (updatedOrder) => {
    set((state) => ({
      orders: state.orders.map((order) =>
        order.id === updatedOrder.id ? updatedOrder : order
      ),
    }));
  },
  deleteOrder: (id) => {
    set((state) => ({
      orders: state.orders.filter((order) => order.id !== id),
    }));
  },
  updateSettings: (newSettings) => {
    set({ settings: newSettings });
  },
  connectWebSocket: () => {
    let ws: WebSocket | null = null;
    const connect = () => {
      const token = 'H_-D_3Q789Ru'; // Replace with your actual token retrieval logic
      const wsUrl = `wss://nft.memextoken.org:24678/?token=${token}`;
      console.log('Attempting to connect to WebSocket:', wsUrl);
      ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log('WebSocket connected');
      };

      ws.onmessage = (event) => {
        console.log('WebSocket message received:', event.data);
      };

      ws.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code, event.reason);
        // Implement retry logic here
        setTimeout(() => {
          console.log('Attempting to reconnect WebSocket...');
          connect();
        }, 3000); // Retry after 3 seconds
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        ws?.close(); // Close the WebSocket on error to trigger the onclose event
      };
    };

    connect();

    // Return a cleanup function to close the WebSocket when the component unmounts
    return () => {
      if (ws) {
        ws.close();
      }
    };
  },
}));
