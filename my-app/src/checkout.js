import React, { useEffect, useState } from 'react';
import './checkout.css';

function CheckoutPage({ userId, navigateTo }) {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);

  // ✅ Fetch cart items with authentication
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await fetch(`http://localhost:555/cart`, {
          method: 'GET',
          credentials: 'include', // 🔥 Ensures the authToken is sent
        });

        if (!response.ok) throw new Error('Failed to fetch cart');

        const data = await response.json();
        setCartItems(data);

        // ✅ Recalculate total
        const totalAmount = data.reduce((acc, item) => acc + item.PRICE * item.QUANTITY, 0);
        setTotal(totalAmount);
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    };

    fetchCartItems();
  }, [userId]); // ✅ Keeps dependency unchanged

  const completePurchase = async () => {
    try {
      const response = await fetch(`http://localhost:555/checkout`, {
        method: 'POST',
        credentials: 'include', // 🔥 Ensures token is sent for authentication
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cartItems }), // ✅ No need to send userId (backend gets it from token)
      });

      if (!response.ok) {
        throw new Error('Failed to complete purchase.');
      }

      alert('Purchase completed successfully!');
      
      // ✅ Clear cart after purchase
      setCartItems([]);
      setTotal(0);
      
      // ✅ Redirect to homepage
      navigateTo('home');

    } catch (error) {
      console.error('Error completing purchase:', error);
      alert(error.message);
    }
  };

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="checkout-items">
          {cartItems.map((item, index) => (
            <div className="checkout-item" key={index}>
              <h3>{item.NAME}</h3>
              <p>Brand: {item.BRAND}</p>
              <p>Price: ${item.PRICE.toFixed(2)}</p>
              <p>Quantity: {item.QUANTITY}</p>
              <p>Total: ${(item.PRICE * item.QUANTITY).toFixed(2)}</p>
            </div>
          ))}
          <div className="checkout-summary">
            <h2>Total Cost: ${total.toFixed(2)}</h2>
          </div>
          <button className="complete-purchase-button" onClick={completePurchase}>
            Complete Purchase
          </button>
        </div>
      )}
    </div>
  );
}

export default CheckoutPage;
