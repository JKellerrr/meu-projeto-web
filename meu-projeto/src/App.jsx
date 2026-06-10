import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Produtos from './pages/Produtos';
import Carrinho from './pages/Carrinho';
import Contatos from './pages/Contatos';

function App() {
  return (
    <ThemeProvider>
      <CartProvider>
        <Router>
          <div className="container-fluid">
            <h1 className="text-center text-primary mt-5">Lançamento Oficial</h1>
          </div>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/produtos" element={<Produtos />} />
            <Route path="/carrinho" element={<Carrinho />} />
            <Route path="/contatos" element={<Contatos />} />
          </Routes>
        </Router>
      </CartProvider>
    </ThemeProvider>
  );
}

export default App;
