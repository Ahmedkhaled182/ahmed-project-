import React, { useEffect, useState } from 'react';
import './admin.css';

function AdminPage({ navigateTo }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:555/admin/orders', {
          method: 'GET',
          credentials: 'include', // 🔥 Ensures authToken is sent
        });
 
        console.log("Response Status:", response.status); // Debugging
 
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch orders: ${errorText}`);
        }
 
        const data = await response.json();
        console.log("Orders Data:", data); // Debugging
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setErrorMessage(error.message);
      } finally {
        setLoading(false);
      }
    };
 
    fetchOrders();
  }, []);
 

  return (
    <div className="admin-page">
      <h1>Admin Dashboard</h1>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p>No orders have been placed yet.</p>
      ) : (
        <div className="orders-list">
          {orders.map((order, index) => (
            <div className="order-card" key={index}>
              <h3>Order ID: {order.ID}</h3>
              <p><strong>User ID:</strong> {order.USER_ID}</p>
              <p><strong>Items:</strong> {order.ITEMS}</p>
              <p><strong>Total Price:</strong> ${order.TOTAL_PRICE.toFixed(2)}</p>
              <p><strong>Date:</strong> {new Date(order.DATE).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
      <button className="back-button" onClick={() => navigateTo('home')}>
        Back to Home
      </button>
    </div>
  );
}

export default AdminPage;
