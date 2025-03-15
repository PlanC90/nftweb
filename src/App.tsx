import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Admin } from './pages/Admin';
import { Purchase } from './pages/Purchase';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ScrollToTopButton } from './components/ScrollToTopButton';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-900">
        <div className="container mx-auto max-w-7xl shadow-lg rounded-lg overflow-hidden">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/purchase/:id" element={<Purchase />} />
            </Routes>
          </main>
          <Footer />
          <ScrollToTopButton />
        </div>
      </div>
    </Router>
  );
}

export default App;
