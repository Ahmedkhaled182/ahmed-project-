const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const db_access = require('./data-base.js');
const db = db_access.db;
const server = express();
const port = 555;
const secret_key = 'DdsdsdKKFDDFDdvfddvxvc4dsdvdsvdb';

server.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));
server.use(express.json());
server.use(cookieParser());

const generateToken = (id, isAdmin) => {
    return jwt.sign({ id, isAdmin }, secret_key, { expiresIn: '1h' });
};

const verifyToken = (req, res, next) => {
    const token = req.cookies.authToken;
    if (!token) return res.status(401).send('Unauthorized');
    
    jwt.verify(token, secret_key, (err, details) => {
        if (err) return res.status(403).send('Invalid or expired token');
        req.userDetails = details;
        next();
    });
};

// Login Route with Token Generation
server.post('/user/login', (req, res) => {
    const { email, password } = req.body;
    db.get(`SELECT * FROM USER WHERE EMAIL=?`, [email], (err, row) => {
        if (err) return res.status(500).json({ error: 'Error retrieving user data.' });
        if (!row) return res.status(404).json({ error: 'User not found' });

        bcrypt.compare(password, row.PASSWORD, (err, isMatch) => {
            if (err) return res.status(500).json({ error: 'Error comparing passwords.' });
            if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });
            
            const token = generateToken(row.ID, row.ISADMIN);
            res.cookie('authToken', token, {
                httpOnly: true,
                sameSite: 'none',
                secure: true,
                expiresIn: '1h'
            });
            return res.status(200).json({ message: 'Login successful', isAdmin: row.ISADMIN === 1 });
        });
    });
});

// Registration Route
server.post('/user/register', (req, res) => {
    const { name, email, password } = req.body;
    db.get(`SELECT * FROM USER WHERE EMAIL = ?`, [email], (err, row) => {
        if (err) return res.status(500).send('Error checking email.');
        if (row) return res.status(400).send('Email already in use.');
        
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) return res.status(500).send('Error hashing password');
            db.run(`INSERT INTO USER (NAME, EMAIL, PASSWORD, ISADMIN) VALUES (?, ?, ?, ?)`,
                [name, email, hashedPassword, 0], (err) => {
                    if (err) return res.status(500).send('Error registering user.');
                    return res.status(200).send('Registration successful');
                });
        });
    });
});

// Restore **ALL** original functions **exactly as they were** with token protection added where necessary
server.get('/products', (req, res) => {
    const { category } = req.query;
    if (!category) return res.status(400).send('Category is required.');
    db.all(`SELECT * FROM PERFUME WHERE CATEGORY = ?`, [category], (err, rows) => {
        if (err) return res.status(500).send('Error fetching products.');
        res.json(rows);
    });
});

server.get('/cart', verifyToken, (req, res) => {
    const userId = req.userDetails.id;
    const query = `SELECT C.ID AS CART_ID, P.NAME, P.BRAND, P.PRICE, C.QUANTITY FROM CART C JOIN PERFUME P ON C.PERFUME_ID = P.ID WHERE C.USER_ID = ?`;
    db.all(query, [userId], (err, rows) => {
        if (err) return res.status(500).send('Error fetching cart items.');
        res.json(rows);
    });
});

// Add Item to Cart
server.post('/cart/add', (req, res) => {
  const { userId, perfumeId, quantity } = req.body;
  if (!userId || !perfumeId || quantity == null) {
    return res.status(400).send('Missing required parameters');
  }

  const query = `INSERT INTO CART (USER_ID, PERFUME_ID, QUANTITY) VALUES (?, ?, ?)`;
  db.run(query, [userId, perfumeId, quantity], function(err) {
    if (err) {
      console.error('Error adding item to cart:', err.message);
      return res.status(500).send('Error adding item to cart');
    }
    res.status(200).send('Item added to cart successfully');
  });
});

server.delete('/cart/clear', verifyToken, (req, res) => {
  const userId = req.userDetails.id; // ✅ Extract user ID from token
  console.log(`Clearing cart for user: ${userId}`); // 🔥 Debugging log

  const query = `DELETE FROM CART WHERE USER_ID = ?`;
  db.run(query, [userId], function (err) {
      if (err) {
          console.error('Error clearing cart:', err.message);
          return res.status(500).send('Error clearing cart.');
      }

      console.log('Cart successfully cleared for user:', userId); // 🔥 Debugging log
      res.status(200).send('Cart cleared.');
  });
});


server.post('/checkout', verifyToken, (req, res) => {
    const userId = req.userDetails.id;
    const fetchCartItemsQuery = `SELECT * FROM CART WHERE USER_ID = ?`;
    const insertPurchaseQuery = `INSERT INTO PURCHASES (USER_ID, PERFUME_ID, QUANTITY) VALUES (?, ?, ?)`;
    const clearCartQuery = `DELETE FROM CART WHERE USER_ID = ?`;

    db.all(fetchCartItemsQuery, [userId], (err, cartItems) => {
        if (err) return res.status(500).send('Error fetching cart items.');
        if (!cartItems.length) return res.status(400).send('Cart is empty.');
        
        cartItems.forEach((item) => {
            db.run(insertPurchaseQuery, [userId, item.PERFUME_ID, item.QUANTITY], (err) => {
                if (err) console.error('Error inserting into PURCHASES:', err.message);
            });
        });
        
        db.run(clearCartQuery, [userId], (err) => {
            if (err) return res.status(500).send('Error clearing cart.');
            res.status(200).send('Purchase completed successfully!');
        });
    });
});

server.get('/admin/orders', verifyToken, (req, res) => {
    const isAdmin = req.userDetails.isAdmin;
    if (isAdmin !== 1) {
        return res.status(403).send('Access denied. Admins only.');
    }

    const query = `
        SELECT O.ID, O.USER_ID, 
        GROUP_CONCAT(P.NAME || ' (x' || O.QUANTITY || ')') AS ITEMS, 
        SUM(O.QUANTITY * P.PRICE) AS TOTAL_PRICE, 
        MAX(O.DATE) AS ORDER_DATE  -- Ensure Date Aggregation Works
        FROM PURCHASES O
        JOIN PERFUME P ON O.PERFUME_ID = P.ID
    GROUP BY O.ID, O.USER_ID
`;

    console.log("Executing SQL Query for Orders...");

    db.all(query, (err, rows) => {
        if (err) {
            console.error('Error fetching orders:', err.message); // 🔍 Debugging Log
            return res.status(500).send(`Error fetching orders: ${err.message}`);
        }

        console.log("Orders Retrieved: ", rows); // 🔍 Debugging Log
        res.json(rows);
    });
});


server.listen(port, () => {
    console.log(`Server running at port ${port}`);
});
