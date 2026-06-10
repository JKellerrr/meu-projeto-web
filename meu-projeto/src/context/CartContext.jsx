import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('carrinho');
    return savedCart ? JSON.parse(savedCart) : {};
  });

  useEffect(() => {
    localStorage.setItem('carrinho', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (produtoId, nomeProduto, preco, quantidade = 1) => {
    setCart((prevCart) => {
      const newCart = { ...prevCart };
      if (newCart[produtoId]) {
        newCart[produtoId].quantidade += quantidade;
      } else {
        newCart[produtoId] = {
          nome: nomeProduto,
          preco: preco,
          quantidade: quantidade,
        };
      }
      alert(`${nomeProduto} (x${quantidade}) adicionado ao carrinho!`);
      return newCart;
    });
  };

  const removeFromCart = (produtoId) => {
    setCart((prevCart) => {
      const newCart = { ...prevCart };
      delete newCart[produtoId];
      return newCart;
    });
  };

  const updateQuantity = (produtoId, quantidade) => {
    setCart((prevCart) => {
      const newCart = { ...prevCart };
      if (newCart[produtoId]) {
        newCart[produtoId].quantidade = quantidade;
      }
      return newCart;
    });
  };

  const calculateTotal = () => {
    return Object.values(cart).reduce((total, item) => total + item.preco * item.quantidade, 0);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, calculateTotal }}>
      {children}
    </CartContext.Provider>
  );
};
