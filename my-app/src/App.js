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
import AdminPage from './admin';


function App() {
  const [currentPage, setCurrentPage] = useState('login'); 
  const [isAuthenticated, setIsAuthenticated] = useState(false); 

  const userId = 1; 
  const isAdmin = localStorage.getItem('isAdmin') === 'true'; // Get admin Status

  const navigateTo = (page) => {
    if (!isAuthenticated && page !== 'login' && page !== 'signup') {
      return setCurrentPage('login'); 
    }
    setCurrentPage(page);
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setCurrentPage('home'); 
  };

  return (
    <div className="App">
      {currentPage !== 'login' && currentPage !== 'signup' && <Navbar navigateTo={navigateTo} isAdmin={isAdmin} />}
      
      {currentPage === 'login' && <Login navigateTo={navigateTo} onLoginSuccess={handleLoginSuccess} />}
      {currentPage === 'signup' && <SignUp navigateTo={navigateTo} />}
      {currentPage === 'home' && <Homepage navigateTo={navigateTo} />}
      {currentPage === 'men-products' && <MenProducts userId={userId} />}
      {currentPage === 'women-products' && <WomenProducts userId={userId} />}
      {currentPage === 'cart' && <Cart userId={userId} navigateTo={navigateTo} />}
      {currentPage === 'checkout' && <Checkout userId={userId} navigateTo={navigateTo} />}
      {currentPage === 'admin' && isAdmin && <AdminPage navigateTo={navigateTo} />}
    </div>
  );
}

export default App;
