import React, { useEffect, useState } from 'react';
import './navbar.css';

function Navbar({ navigateTo }) {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const adminStatus = localStorage.getItem('isAdmin') === 'true'; 
    setIsAdmin(adminStatus);
  }, []);

  return (
    <nav className="navbar">
      <button className="nav-button" onClick={() => navigateTo('home')}>Home</button>
      <button className="nav-button" onClick={() => navigateTo('men-products')}>Men</button>
      <button className="nav-button" onClick={() => navigateTo('women-products')}>Women</button>
      <button className="nav-button" onClick={() => navigateTo('cart')}>Cart</button>
      <button className="nav-button" onClick={() => navigateTo('login')}>Logout</button>
      {isAdmin && (
        <button className="nav-button admin" onClick={() => navigateTo('admin')}>Admin</button>
      )}
    </nav>
  );
}

export default Navbar;
