import React from 'react';
import './homepage.css';

function Homepage({ navigateTo }) {
  return (
    <div className="homepage-page">
      <div className="homepage-welcome-section">
        <h1>Welcome to Scented Secrets</h1>
        <p>Discover your perfect fragrance!</p>
      </div>

      <section className="homepage-featured-section">
        <h2>What We Offer</h2>
        <div className="homepage-featured-grid">
          {/* For Him Section */}
          <div className="homepage-featured-item">
            <img
              src="https://th.bing.com/th/id/OIP.yZ2Sj6rAdZ6FRjLX3LmVFQHaE8?rs=1&pid=ImgDetMain" 
              alt="For Him"
              className="featured-image"
            />
            <h3>Men's Fragrances</h3>
            <button
              className="homepage-category-button"
              onClick={() => navigateTo('men-products')}
            >
              For Him
            </button>
          </div>
          {/* For Her Section */}
          <div className="homepage-featured-item">
            <img
              src="https://www.fashiongonerogue.com/wp-content/uploads/2021/05/Beauty-Model-Spraying-Perfume-Blue-Bottle-450x300.jpg" 
              alt="For Her"
              className="featured-image"
            />
            <h3>Women's Fragrances</h3>
            <button
              className="homepage-category-button"
              onClick={() => navigateTo('women-products')}
            >
              For Her
            </button>
          </div>
        </div>
      </section>

      <footer className="homepage-footer">
        <p>&copy; 2024 Scented Secrets. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default Homepage;
