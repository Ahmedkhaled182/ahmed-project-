import React from 'react';
import './navbar.css';

function Navbar({ navigateTo }) {
  return (
    <nav className="navbar">
      <button className="nav-button" onClick={() => navigateTo('home')}>Home</button>
      <button className="nav-button" onClick={() => navigateTo('login')}>Login</button>
      <button className="nav-button" onClick={() => navigateTo('men-products')}>Men</button>
      <button className="nav-button" onClick={() => navigateTo('women-products')}>Women</button>
      <button className="nav-button" onClick={() => navigateTo('cart')}>cart</button>
    </nav>
  );
}

export default Navbar;
