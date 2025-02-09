import React, { useEffect, useState } from 'react';
import './cart.css';

function CartPage({ userId, navigateTo }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCartItems = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:555/cart`, {
          method: 'GET',
          credentials: 'include', // 🔥 Sends auth cookies for authentication
        });
        if (!response.ok) throw new Error('Failed to fetch cart');
        const data = await response.json();
        setCartItems(data);
      } catch (error) {
        console.error('Error fetching cart items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [userId]); // ✅ Dependency is correct

  const clearCart = async () => {
    try {
        console.log('Attempting to clear cart...'); // 🔥 Debugging

        const response = await fetch(`http://localhost:555/cart/clear`, {
            method: 'DELETE',
            credentials: 'include', // ✅ Ensures auth token is sent
        });

        console.log('Clear cart response status:', response.status); // 🔥 Debugging

        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`Failed to clear cart: ${errorData}`);
        }

        console.log('Cart cleared successfully');
        setCartItems([]); // ✅ Update state to reflect cleared cart
        alert('Cart cleared.');
    } catch (error) {
        console.error('Error clearing cart:', error.message);
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
