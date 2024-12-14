const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const db_access = require('./data-base.js');
const db = db_access.db;
const server = express();
const port = 555;

server.use(cors());
server.use(express.json());

// User Login Route
server.post('/user/login', (req, res) => {
  const { email, password } = req.body;

  db.get(`SELECT * FROM USER WHERE EMAIL=?`, [email], (err, row) => {
    if (err) {
      console.error('Error retrieving user data:', err);
      return res.status(500).send('Error retrieving user data.');
    }
    if (!row) {
      return res.status(404).send('User not found');
    }

    bcrypt.compare(password, row.PASSWORD, (err, isMatch) => {
      if (err) {
        console.error('Error comparing passwords:', err);
        return res.status(500).send('Error comparing passwords.');
      }
      if (!isMatch) {
        return res.status(401).send('Invalid credentials');
      }

      return res.status(200).send('Login successful');
    });
  });
});

// User Registration Route
server.post('/user/register', (req, res) => {
  const { name, email, password } = req.body;

  db.get(`SELECT * FROM USER WHERE EMAIL = ?`, [email], (err, row) => {
    if (err) {
      console.error('Error checking email:', err);
      return res.status(500).send('Error checking email.');
    }
    if (row) {
      return res.status(400).send('Email already in use.');
    }

    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        console.error('Error hashing password:', err);
        return res.status(500).send('Error hashing password');
      }

      db.run(`INSERT INTO USER (NAME, EMAIL, PASSWORD, ISADMIN) VALUES (?, ?, ?, ?)`,
        [name, email, hashedPassword, 0], (err) => {
          if (err) {
            console.error('Error registering user:', err);
            return res.status(500).send('Error registering user.');
          }
          return res.status(200).send('Registration successful');
        });
    });
  });
});

// API to Fetch Products by Category
server.get('/products', (req, res) => {
  const { category } = req.query;

  if (!category) {
    return res.status(400).send('Category is required.');
  }

  const query = `SELECT * FROM PERFUME WHERE CATEGORY = ?`;
  db.all(query, [category], (err, rows) => {
    if (err) {
      console.error('Error fetching products:', err.message);
      return res.status(500).send('Internal Server Error');
    }

    res.json(rows);
  });
});

// Route to Add Item to Cart
server.post('/cart/add', (req, res) => {
  const { userId, perfumeId, quantity } = req.body;

  if (!userId || !perfumeId || !quantity) {
    return res.status(400).send('Missing required fields');
  }

  const query = `
    INSERT INTO CART (USER_ID, PERFUME_ID, QUANTITY)
    VALUES (?, ?, ?)
  `;

  db.run(query, [userId, perfumeId, quantity], function (err) {
    if (err) {
      console.error('Error adding to cart:', err.message);
      return res.status(500).send('Error adding item to cart.');
    }
    res.status(200).send('Item added to cart.');
  });
});

// Route to Fetch Items in the Cart
server.get('/cart', (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).send('User ID is required');
  }

  const query = `
    SELECT C.ID AS CART_ID, P.NAME, P.BRAND, P.PRICE, C.QUANTITY
    FROM CART C
    JOIN PERFUME P ON C.PERFUME_ID = P.ID
    WHERE C.USER_ID = ?
  `;

  db.all(query, [userId], (err, rows) => {
    if (err) {
      console.error('Error fetching cart items:', err.message);
      return res.status(500).send('Error fetching cart items.');
    }

    res.json(rows);
  });
});

// Route to Clear the Cart
server.delete('/cart/clear', (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).send('User ID is required');
  }

  const query = `
    DELETE FROM CART WHERE USER_ID = ?
  `;

  db.run(query, [userId], function (err) {
    if (err) {
      console.error('Error clearing cart:', err.message);
      return res.status(500).send('Error clearing cart.');
    }
    res.status(200).send('Cart cleared.');
  });
});

// Checkout Route to Complete Purchase
server.post('/checkout', (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).send('User ID is required');
  }

  const fetchCartItemsQuery = `
    SELECT * FROM CART WHERE USER_ID = ?
  `;
  const insertPurchaseQuery = `
    INSERT INTO PURCHASES (USER_ID, PERFUME_ID, QUANTITY)
    VALUES (?, ?, ?)
  `;
  const clearCartQuery = `
    DELETE FROM CART WHERE USER_ID = ?
  `;

  db.serialize(() => {
    db.all(fetchCartItemsQuery, [userId], (err, cartItems) => {
      if (err) {
        console.error('Error fetching cart items:', err.message);
        return res.status(500).send('Error fetching cart items.');
      }

      if (cartItems.length === 0) {
        return res.status(400).send('Cart is empty.');
      }

      cartItems.forEach((item) => {
        db.run(insertPurchaseQuery, [userId, item.PERFUME_ID, item.QUANTITY], (err) => {
          if (err) {
            console.error('Error inserting into PURCHASES:', err.message);
          }
        });
      });

      db.run(clearCartQuery, [userId], (err) => {
        if (err) {
          console.error('Error clearing cart:', err.message);
          return res.status(500).send('Error clearing cart.');
        }
        res.status(200).send('Purchase completed successfully!');
      });
    });
  });
});

// Start the Server
server.listen(port, () => {
  console.log(`Server running at port ${port}`);
});
