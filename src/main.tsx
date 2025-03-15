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

  return <App />;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>
);
