import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ScrollToTop />
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// Add this to debug WebSocket connection
const setupWebSocket = () => {
  const token = 'H_-D_3Q789Ru'; // Replace with the actual token retrieval logic
  const ws = new WebSocket(`wss://nft.memextoken.org:24678/?token=${token}`);
  let reconnectInterval = 3000; // Initial reconnect interval

  ws.onopen = () => {
    console.log('WebSocket connected');
    reconnectInterval = 3000; // Reset reconnect interval on successful connection
  };

  ws.onmessage = (event) => {
    console.log('WebSocket message:', event.data);
  };

  ws.onclose = () => {
    console.log('WebSocket disconnected');
    // Attempt to reconnect after a delay
    setTimeout(setupWebSocket, reconnectInterval);
    reconnectInterval = Math.min(reconnectInterval * 2, 60000); // Exponential backoff
  };

  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
    ws.close(); // Close the WebSocket on error to trigger reconnection
  };
};

setupWebSocket();
