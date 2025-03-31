import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartcontextItems, setCartcontextItems] = useState([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('librarycart');
    if (savedCart) {
      setCartcontextItems(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    if (cartcontextItems.length > 0) {
      localStorage.setItem('librarycart', JSON.stringify(cartcontextItems));
    }
  }, [cartcontextItems]);

  const getCartLength = () => {
    return cartcontextItems.length;
  };

  return (
    <CartContext.Provider value={{ cartcontextItems, setCartcontextItems, getCartLength }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
