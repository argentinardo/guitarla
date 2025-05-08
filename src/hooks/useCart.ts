import { useState, useEffect, useMemo } from "react";
import db from "../data/db";
import type {Guitar,CartItem} from '../types'

export const useCart = () => {
  const initialCart = () : CartItem[] => {
    const localStorageCart = localStorage.getItem("cart");
    return localStorageCart ? JSON.parse(localStorageCart) : [];
  };
  const [data, setData] = useState([]);
  const [cart, setCart] = useState(initialCart);
  useEffect(() => {
    setData(db);
  }, [setCart]);
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);
  function addToCart(guitar:Guitar) {
    const itemExist = cart.findIndex((item) => guitar.id === item.id);
    if (itemExist >= 0) {
      const updatedCart = [...cart];
      updatedCart[itemExist].quantity++;
      setCart(updatedCart);
    } else {
      const newItem : CartItem = {...guitar, quantity : 1}
      setCart([...cart, newItem]);
    }
  }

  function removeFromCart(id: Guitar['id']) {
    setCart((prevState) => prevState.filter((guitar) => guitar.id !== id));
  }

  function cleanCart() {
    const updatedCart:[]  = [];
    setCart(updatedCart);
  }

  function increaseQuantity(id: Guitar['id']) {
    const updatedCart = cart.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCart(updatedCart);
  }

  function decreaseQuantity(id: Guitar['id']) {
    const updatedCart = cart.map((item) =>
      item.id === id && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    setCart(updatedCart);
  }
  const isEmpty:boolean = useMemo(() => cart.length === 0, [cart]);
  const totalPrice:number = useMemo(() => cart.reduce((total, item) => (item.quantity * item.price + total), 0), [cart]);

  return {
    data,
    cart,
    addToCart,
    removeFromCart,
    cleanCart,
    increaseQuantity,
    decreaseQuantity,
    isEmpty,
    totalPrice
  };
};
