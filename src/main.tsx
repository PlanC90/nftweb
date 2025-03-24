import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { useStore } from './store';

function Root() {
  const { loadInitialData } = useStore();

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Function to establish WebSocket connection
  const setupWebSocket = () => {
    const token = 'A-WR1onrC2rm';
    const wsUrl = `wss://nft.memextoken.org:24678/?token=${token}`; // Use wss
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('WebSocket connected in main.tsx');
    };

    ws.onmessage = (event) => {
      console.log('Received in main.tsx:', event.data);
    };

    ws.onclose = (event) => {
      console.log('WebSocket disconnected in main.tsx', event.code, event.reason);
      // Attempt to reconnect after a delay
      setTimeout(setupWebSocket, 3000);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error in main.tsx:', error);
    };
  };

  useEffect(() => {
    loadInitialData();
    setupWebSocket(); // Call WebSocket setup
  }, []);

  return <App />;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>
);
