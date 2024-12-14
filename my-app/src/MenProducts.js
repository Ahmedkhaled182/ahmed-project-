import React, { useEffect, useState } from 'react';
import './MenProducts.css';

function MenProducts({ userId }) {
  const [products, setProducts] = useState([]);

  // Fetch products on component mount
  useEffect(() => {
    fetch('http://localhost:555/products?category=men') 
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error('Error fetching men products:', error));
  }, []);

  // Function to handle adding an item to the cart
  const addToCart = async (perfumeId) => {
    try {
      const response = await fetch('http://localhost:555/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, perfumeId, quantity: 1 })
      });
  
      if (response.ok) {
        alert('Item added to cart!');
      } else {
        alert('Failed to add item to cart.');
      }
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  };

  return (
    <div className="men-products-page">
      <h1>Men's Fragrances</h1>
      <div className="products-grid">
        {products.map((product) => (
          <div className="product-card" key={product.ID}>
            {/* Include product image */}
            <img
              src={product.IMAGE_URL || '/placeholder.jpg'}
              alt={product.NAME}
              className="product-image"
            />
            <h3>{product.NAME}</h3>
            <p>{product.BRAND}</p>
            <p>${product.PRICE.toFixed(2)}</p>
            <button onClick={() => addToCart(product.ID)}>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MenProducts;
