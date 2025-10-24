import { useState, useEffect } from "react";

export interface CartItem {
  id: number;
  name: string;
  price: string;
  image: string;
  quantity: number;
}

export const useCart = () => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [updateTrigger, setUpdateTrigger] = useState(0);

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      try {
        setItems(JSON.parse(storedCart));
      } catch (error) {
        console.error("Error parsing cart:", error);
      }
    }
  }, []);

  const addToCart = (product: Omit<CartItem, "quantity">) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === product.id);

      let newItems;
      if (existingItem) {
        newItems = currentItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        newItems = [...currentItems, { ...product, quantity: 1 }];
      }

      localStorage.setItem("cart", JSON.stringify(newItems));
      //forzamos actualización del trigger
      setUpdateTrigger((prev) => prev + 1);
      return newItems;
    });
  };

  const removeFromCart = (productId: number) => {
    setItems((currentItems) => {
      const newItems = currentItems.filter((item) => item.id !== productId);
      localStorage.setItem("cart", JSON.stringify(newItems));
      //forzamos actualización del trigger
      setUpdateTrigger((prev) => prev + 1);
      return newItems;
    });
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setItems((currentItems) => {
      const newItems = currentItems.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      );
      localStorage.setItem("cart", JSON.stringify(newItems));
      //volvemos a forzar actualización del trigger
      setUpdateTrigger((prev) => prev + 1);
      return newItems;
    });
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem("cart");
    //volvemos a forzar actualización del trigger
    setUpdateTrigger((prev) => prev + 1);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + parseFloat(item.price) * item.quantity,
    0
  );

  return {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
  };
};
