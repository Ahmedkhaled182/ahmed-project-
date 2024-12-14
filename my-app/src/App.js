import React, { useState } from 'react';
import './App.css';
import Navbar from './navbar';
import Login from './login';
import SignUp from './signup';
import Homepage from './homepage';
import MenProducts from './MenProducts';
import WomenProducts from './WomenProducts';
import Cart from './cart'; 
import Checkout from './checkout';

function App() {
  const [currentPage, setCurrentPage] = useState('login'); // Default page: login
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Authentication status
  const userId = 1; 

  const navigateTo = (page) => {
    if (!isAuthenticated && page !== 'login' && page !== 'signup') {
      return setCurrentPage('login'); // Redirect unauthenticated users to login
    }
    setCurrentPage(page);
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true); // Set authenticated status
    setCurrentPage('home'); // Redirect to homepage after login
  };

  return (
    <div className="App">
      {/* Show Navbar on all pages except login and signup */}
      {currentPage !== 'login' && currentPage !== 'signup' && <Navbar navigateTo={navigateTo} />}

      {/* Conditional Rendering of Pages */}
      {currentPage === 'login' && (
        <Login navigateTo={navigateTo} onLoginSuccess={handleLoginSuccess} />
      )}
      {currentPage === 'signup' && <SignUp navigateTo={navigateTo} />}
      {currentPage === 'home' && <Homepage navigateTo={navigateTo} />}
      {currentPage === 'men-products' && <MenProducts userId={userId} />} {/* Pass userId */}
      {currentPage === 'women-products' && <WomenProducts userId={userId} />} {/* Pass userId */}
      {currentPage === 'cart' && <Cart userId={userId} navigateTo={navigateTo} />} {/* Pass navigateTo */}
      {currentPage === 'checkout' && <Checkout userId={userId} navigateTo={navigateTo} />} {/* Pass navigateTo */}
    </div>
  );
}

export default App;
