const sqlite = require('sqlite3');
const db = new sqlite.Database('perfume_shop.db');

// Create USER table
const createUserTable = `
CREATE TABLE IF NOT EXISTS USER (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    NAME TEXT NOT NULL,
    EMAIL TEXT UNIQUE NOT NULL,
    PASSWORD TEXT NOT NULL,
    ISADMIN INT
)`;

// Create PERFUME table with CATEGORY and IMAGE_URL columns
const createPerfumeTable = `
CREATE TABLE IF NOT EXISTS PERFUME (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    NAME TEXT NOT NULL,
    BRAND TEXT NOT NULL,
    PRICE REAL NOT NULL,
    DESCRIPTION TEXT,
    QUANTITY INT NOT NULL,
    CATEGORY TEXT NOT NULL,
    IMAGE_URL TEXT
)`;

// Create PURCHASES table
const createPurchaseTable = `
CREATE TABLE IF NOT EXISTS PURCHASES (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    USER_ID INT NOT NULL,
    PERFUME_ID INT NOT NULL,
    QUANTITY INT NOT NULL,
    FOREIGN KEY (USER_ID) REFERENCES USER(ID),
    FOREIGN KEY (PERFUME_ID) REFERENCES PERFUME(ID)
)`;

// Create CART table
const createCartTable = `
CREATE TABLE IF NOT EXISTS CART (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    USER_ID INT NOT NULL,
    PERFUME_ID INT NOT NULL,
    QUANTITY INT NOT NULL,
    FOREIGN KEY (USER_ID) REFERENCES USER(ID),
    FOREIGN KEY (PERFUME_ID) REFERENCES PERFUME(ID)
);
`;

// Initialize tables
db.serialize(() => {
  // Create USER table
  db.run(createUserTable, (err) => {
    if (err) console.error('Error creating USER table:', err.message);
    else console.log('USER table created or already exists.');
  });

  // Create PERFUME table
  db.run(createPerfumeTable, (err) => {
    if (err) console.error('Error creating PERFUME table:', err.message);
    else console.log('PERFUME table created or already exists.');
  });

  // Create PURCHASES table
  db.run(createPurchaseTable, (err) => {
    if (err) console.error('Error creating PURCHASES table:', err.message);
    else console.log('PURCHASES table created or already exists.');
  });

  // Create CART table
  db.run(createCartTable, (err) => {
    if (err) console.error('Error creating CART table:', err.message);
    else console.log('CART table created or already exists.');
  });

  // Check if PERFUME table is empty before inserting sample data
  db.get(`SELECT COUNT(*) AS count FROM PERFUME`, (err, row) => {
    if (err) {
      console.error('Error checking PERFUME table:', err.message);
    } else if (row.count === 0) {
      // Insert sample perfumes into PERFUME table
      const samplePerfumesQuery = `
  INSERT INTO PERFUME (NAME, BRAND, PRICE, DESCRIPTION, QUANTITY, CATEGORY, IMAGE_URL)
  VALUES
  ('Valentino uomo', 'Brand A', 49.99, 'Fresh and invigorating', 10, 'men', 'https://m.media-amazon.com/images/I/71w9oj9Wp-L.jpg'),
  ('YSL myself', 'Brand B', 59.99, 'Deep woody scent', 8, 'men', 'https://i5.walmartimages.com/seo/Myself-by-Yves-Saint-Laurent-Eau-De-Parfum-2-0oz-60ml-Spray-New-With-Box_a7d37d4b-987e-4aab-843f-6375beeab7b9.aa5c34cf6519af9d756944ae2723a8da.jpeg?odnHeight=640&odnWidth=640&odnBg=FFFFFF'),
  ('Mont blanc explorer', 'Brand C', 29.99, 'Citrusy, light fragrance', 12, 'men', 'https://th.bing.com/th/id/R.9c5eb51a16f4d29819114d2564c364d5?rik=n6VNMmcsHB9abQ&pid=ImgRaw&r=0'),
  ('Good girl', 'Brand D', 69.99, 'A floral and sweet fragrance for women', 15, 'women', 'https://cdn.shopify.com/s/files/1/2978/5842/products/perfume-good-girl-for-women-by-carolina-herrera-eau-de-parfum-spray-2.jpg?v=1546632192'),
  ('Black opium', 'Brand E', 39.99, 'A vanilla-based warm scent for women', 10, 'women', 'https://th.bing.com/th/id/OIP.l953iTQUC8iixl3ku2XsEQHaHa?rs=1&pid=ImgDetMain'),
  ('Tom-Ford-Tobacco-Vanille', 'Brand F', 55.99, 'A refreshing aquatic fragrance for women', 7, 'women', 'https://perfumestuff.com/wp-content/uploads/2022/02/Tom-Ford-Tobacco-Vanille-EDP-For-Women-100ml.jpg');
`;


      db.run(samplePerfumesQuery, (err) => {
        if (err) {
          console.error('Error inserting sample perfumes:', err.message);
        } else {
          console.log('Sample perfumes inserted successfully.');
        }
      });
    } else {
      console.log('PERFUME table already has data. Skipping sample data insertion.');
    }
  });
});

module.exports = { db, createUserTable, createPerfumeTable, createPurchaseTable };
