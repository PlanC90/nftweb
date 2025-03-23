import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Home } from './pages/Home';
import { Marketplace } from './pages/Marketplace';
import { Purchase } from './pages/Purchase';
import { Admin } from './pages/Admin';
import { Login } from './pages/Login';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';
import { ScrollToTopButton } from './components/ScrollToTopButton';
import { useStore } from './store';

function App() {
  const connectWebSocket = useStore((state) => state.connectWebSocket);

  useEffect(() => {
    connectWebSocket();
  }, [connectWebSocket]);

  return (
    <Router>
      <ScrollToTop />
      <Header />
      <div className="container mx-auto py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/purchase/:id" element={<Purchase />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/login" element={<Login />} />
          {/* Hidden admin route */}
          <Route path="/planc" element={<Admin />} />
        </Routes>
      </div>
      <Footer />
      <ScrollToTopButton />
    </Router>
  );
}

export default App;
