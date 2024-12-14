import React, { useEffect, useState, useCallback } from 'react';
import './cart.css';

function CartPage({ userId, navigateTo }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCartItems = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:555/cart?userId=${userId}`);
      const data = await response.json();
      setCartItems(data);
    } catch (error) {
      console.error('Error fetching cart items:', error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  const clearCart = async () => {
    try {
      await fetch(`http://localhost:555/cart/clear`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });
      setCartItems([]);
      alert('Cart cleared.');
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>
      {loading && <p>Loading cart items...</p>}
      {!loading && cartItems.length === 0 && <p>Your cart is empty.</p>}
      <div className="cart-items">
        {cartItems.map((item, index) => (
          <div className="cart-item" key={index}>
            <h3>{item.NAME}</h3>
            <p>{item.BRAND}</p>
            <p>Price: ${item.PRICE.toFixed(2)}</p>
            <p>Quantity: {item.QUANTITY}</p>
          </div>
        ))}
      </div>
      {cartItems.length > 0 && (
        <div className="cart-actions">
          <button className="clear-cart-button" onClick={clearCart}>
            Clear Cart
          </button>
          <button
            className="checkout-button"
            onClick={() => navigateTo('checkout')}
          >
            Checkout
          </button>
        </div>
      )}
    </div>
  );
}

export default CartPage;
