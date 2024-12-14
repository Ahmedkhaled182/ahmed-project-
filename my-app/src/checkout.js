import React, { useEffect, useState } from 'react';
import './checkout.css';

function CheckoutPage({ userId, navigateTo }) {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);

  // Fetch cart items on page load
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await fetch(`http://localhost:555/cart?userId=${userId}`);
        const data = await response.json();
        setCartItems(data);

        // Calculate total
        const totalAmount = data.reduce((acc, item) => acc + item.PRICE * item.QUANTITY, 0);
        setTotal(totalAmount);
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    };

    fetchCartItems();
  }, [userId]);

  const completePurchase = async () => {
    try {
      const response = await fetch(`http://localhost:555/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, cartItems }),
      });

      if (response.ok) {
        alert('Purchase completed successfully!');
        navigateTo('home'); // Redirect to homepage after purchase
      } else {
        alert('Failed to complete the purchase.');
      }
    } catch (error) {
      console.error('Error completing purchase:', error);
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
