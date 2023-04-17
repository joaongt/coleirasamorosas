import express from 'express';
import path from 'path';
import mysql2 from 'mysql2';
import util from 'util';
import multer from 'multer';
import jwt from 'jsonwebtoken';
import mysql from 'mysql2/promise';
import {
  multerConfig,
  uploadAvatar
} from '../config/multer.js';
// Models
import {
  User
} from '../models/User.js';
import bcrypt from 'bcrypt';
import cookieParser from 'cookie-parser';
import nodemailer from 'nodemailer';
import paypal from 'paypal-rest-sdk';

  // Create a connection to the database
  const connection = mysql2.createConnection(process.env.DATABASE_URL);



const router = express.Router();
const app = express();
app.use(express.static('public'));

app.set('views', path.join(new URL('.',
import.meta.url).pathname, 'views'));

app.use(cookieParser())
// routing
router.get('/', (req, res) => {

  //     // create a connection to the database
  // const connection = mysql2.createConnection(process.env.DATABASE_URL);

  // // connect to the database and execute the query
  // connection.connect((error) => {
  //   if (error) {
  //     console.error('Error connecting to database:', error);
  //     return;
  //   }
  //   else{
  //     console.log('Conectou viu')
  //   }

  //   const query = util.promisify(connection.query).bind(connection);

  //   (async () => {
  //     try {
  //       const userProfile = await query('SELECT profile_photo FROM users');

  res.render('pages/home', {
    title: 'Página Inicial | Coleiras Amorosas',
    style: 'home.css',
    script: 'home.js',
    script2: 'shopBagConfig.js',
    script3: 'login.js',
    // userLogged: userProfile,
  });
  //       } catch (error) {
  //       console.error('Error executing query:', error);
  //     }
  //   })();
  // });
});



router.get('/signup', (req, res) => {

  res.render('pages/signup', {
    title: 'Cadastro | Coleiras Amorosas',
    style: 'signup.css',
    script: 'signup.js',
    script2: 'shopBagConfig.js',
  });
});
router.get('/politica', (req, res) => {

  res.render('pages/politica', {
    title: 'Politica De Privacidade | Coleiras Amorosas',
    style: 'politica.css',
    script: 'politica.js',
    script2: 'shopBagConfig.js',
  });
});
router.get('/about', (req, res) => {

  res.render('pages/about', {
    title: 'Sobre | Coleiras Amorosas',
    style: 'about.css',
    script: 'about.js',
    script2: 'shopBagConfig.js',
  });
});
// Register User
router.post('/auth/register', async (req, res) => {
  const {
    name,
    email,
    cpf,
    tel,
    password,
    confirmPassword
  } = req.body;
  //    
  if (!name) {
    return res.status(422).json({
      msg: 'O nome é obrigatório.'
    })
  }
  if (!email) {
    return res.status(422).json({
      msg: 'O email é obrigatório.'
    })
  }
  if (!cpf) {
    return res.status(422).json({
      msg: 'O CPF é obrigatório.'
    })
  }
  if (!tel) {
    return res.status(422).json({
      msg: 'O telefone é obrigatório.'
    })
  }
  if (!password) {
    return res.status(422).json({
      msg: 'A senha é obrigatória.'
    })
  }
  if (password !== confirmPassword) {
    return res.status(422).json({
      msg: 'As senhas não conferem!'
    })
  }

  // check if user exists
  const userExists = await User.getByEmail(email);

  if (userExists) {
    return res.status(422).json({
      msg: 'Email já cadastrado. \n Por favor utilize outro e-mail.'
    })
  }

  // create password
  const salt = await bcrypt.genSalt(12)
  const passwordHash = await bcrypt.hash(password, salt)

  try {
    await User.create(name, email, cpf, tel, passwordHash);
    res.redirect('../login');
  } catch (error) {
    alert("Ocasionou um erro, tente novamente")
  }

})

router.get('/shop', async (req, res) => {
  // Extract search and category from query parameters
  const search = req.query.search ? `${req.query.search}` : '';
  const category = req.query.category || 'all';
  
  // Calculate the page number to display
  const page = parseInt(req.query.page) || 1;
  const perPage = 4;
  const offset = (page - 1) * perPage;

  try {
     // create a connection to the database
  const connection = mysql2.createConnection(process.env.DATABASE_URL);
    // Connect to the database and execute the query
    await connection.promise().connect();
  
    let products, totalCount;

    if (category === 'all') {
      // Query all products if filter category is 'all'
      [products] = await connection.promise().query(
        `SELECT * FROM products WHERE productName LIKE ? ORDER BY id LIMIT ? OFFSET ?`,
        [`%${search}%`, perPage, offset]
      );
  
      [[totalCount]] = await connection.promise().query(
        `SELECT COUNT(*) AS count FROM products WHERE productName LIKE ?`,
        [`%${search}%`]
      );
    } else {
      // Query products by category if filter category is not 'all'
      [products] = await connection.promise().query(
        `SELECT * FROM products WHERE category = ? AND productName LIKE ? ORDER BY id LIMIT ? OFFSET ?`,
        [category, `%${search}%`, perPage, offset]
      );
  
      [[totalCount]] = await connection.promise().query(
        `SELECT COUNT(*) AS count FROM products WHERE category = ? AND productName LIKE ?`,
        [category, `%${search}%`]
      );
    }
  
    // Generate filter options for categories
    const [categories] = await connection.promise().query(
      `SELECT DISTINCT category FROM products`
    );
  
    // Calculate the number of pages
    const pageCount = Math.ceil(totalCount.count / perPage);
    const pages = [];
    for (let i = 1; i <= pageCount; i++) {
      // Include the search parameter in pagination links
      pages.push({ number: i, active: i === page, search: search, category: category });
    }
  
    // Render the page with the products, categories, and pagination links
    res.render('pages/shop', {
      prods: products,
      title: 'Loja | Coleiras Amorosas',
      style: 'shop.css',
      script: 'shop.js',
      script2: 'shopBagConfig.js',
      search: search,
      categories: categories,
      selectedCategory: category,
      pages: pages
    });
  } catch (error) {
    console.error('Error executing query:', error);
  } finally {
    connection.end();
  }
});


router.get('/adoption', async (req, res) => {
  
  // read the query parameters
  const page = parseInt(req.query.page || '1');
  const breed = req.query.breed || '';
  const type = req.query.type || '';

  // calculate the offset and limit for pagination
  const limit = 2;
  const offset = (page - 1) * limit;

  // connect to the database and execute the query
  connection.connect((error) => {
    if (error) {
      console.error('Error connecting to database:', error);
      return;
    } else {
      console.log('Connected to database');
    }

    const query = util.promisify(connection.query).bind(connection);

    (async () => {
      try {
        // execute the query with filters and pagination
        const [pets, totalCount, breeds] = await Promise.all([
          query(`SELECT * FROM pets WHERE breed LIKE '%${breed}%' AND type LIKE '%${type}%' LIMIT ${limit} OFFSET ${offset}`),
          query(`SELECT COUNT(*) AS count FROM pets WHERE breed LIKE '%${breed}%' AND type LIKE '%${type}%'`),
          query(`SELECT DISTINCT breed FROM pets`),
        ]);
        
        // convert the array of objects into an array of strings
        const breedArray = breeds.map((breedObj) => breedObj.breed);
        

        // calculate pagination variables
        const totalPages = Math.ceil(totalCount[0].count / limit);
        const hasPrev = page > 1;
        const hasNext = page < totalPages;
        const prevPage = hasPrev ? page - 1 : 1;
        const nextPage = hasNext ? page + 1 : totalPages;
         // Calculate the number of pages
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
          // Include the search parameter in pagination links
          pages.push({ number: i, active: i === page });
        }

        res.render('pages/adoption', {
          title: 'Adotar | Coleiras Amorosas',
          style: 'adoption.css',
          script: 'adoption.js',
          script2: 'shopBagConfig.js',
          petss: pets,
          selectedBreed: breed,
          selectedType: type,
          totalPages: totalPages,
          hasPrev: hasPrev,
          hasNext: hasNext,
          prevPage: prevPage,
          nextPage: nextPage,
          pages: pages,
          breeds: breedArray
        });
        
      } catch (error) {
        console.error('Error executing query:', error);
      } finally {
        // close the database connection
        connection.end();
      }
    })();
  });
});



router.post('/submit-pet-form', multer(multerConfig).single('input-pet-img'), async (req, res) => {

 // log the received file
  console.log(req.file);

  // handle form submission here
  const petName = req.body.petName;
  const petAge = req.body.petAge;
  const petType = req.body.petType;
  const petBreed = req.body.petBreed;
  const petPhoneNumber = req.body.phoneNumber;
  const petsInfo = req.body.petInfo;
  const {
    filename: image_path
  } = req.file;
  const imagePath = '../images/pets/users/' + image_path;

  // create a connection to the database
  const connection = mysql2.createConnection(process.env.DATABASE_URL);

  // connect to the database and execute the query
  connection.connect((error) => {
    if (error) {
      console.error('Error connecting to database:', error);
      return;
    } else {
      console.log('Conectou viu')
    }

    const query = util.promisify(connection.query).bind(connection);

    (async () => {
      try {
        const sql = `INSERT INTO pets (name, age, type, breed, image_path, phoneNumber, petInfo) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const values = [petName, petAge, petType, petBreed, imagePath, petPhoneNumber, petsInfo];
        const result = await query(sql, values);
        console.log(result);
        res.redirect('/adoption');
      } catch (error) {
        console.error('Error executing query:', error);
      }
    })();
  });
});





router.post('/user/avatar', multer(uploadAvatar).single('avatar'), async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'Usuário não encontrado' });
    }
    const { filename: image_avatar } = req.file;
    const imageAvatar = '../images/user/avatar/' + image_avatar;
  
    // create a connection to the database
    const connection = mysql2.createConnection(process.env.DATABASE_URL);
  
    // connect to the database and execute the query
    connection.connect((error) => {
      if (error) {
        console.error('Error connecting to database:', error);
        return;
      } else {
        console.log('Conectou viu')
      }
  
      const query = util.promisify(connection.query).bind(connection);
  
      (async () => {
        try {
          const sql = `INSERT INTO users (avatar) VALUES (?)`;
          const values = [imageAvatar];
          const result = await query(sql, values);
          console.log(result);
          router.render('page/profile')
        } catch (error) {
          console.error('Error executing query:', error);
        }
      })();
    });
    await user.save();
    res.status(200).json({ msg: 'Avatar atualizado com sucesso' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro do servidor');
  }

});

router.get('/product/:id', async function(req, res) {
  try {
    // Get the product ID from the request parameters
    var productId = req.params.id;

    // Query the database for the product information
    var product = await getProductById(productId);

    // Render the product page template with the product data
    res.render('pages/product', {
      product: product,
      title: product.productName,
      style: 'product.css',
      script: 'product.js',
    });
  } catch (error) {
    console.error('Error retrieving product:', error);
    res.status(500).send('Error retrieving product');
  }
});

function getProductById(productId) {
  // create a connection to the database
  const connection = mysql2.createConnection(process.env.DATABASE_URL);

  // return a promise that resolves with the product data
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM products WHERE id = ?', [productId], (error, results) => {
      if (error) {
        console.error('Error executing query:', error);
        reject(error);
      } else {
        // If a product with the given ID is found, return it
        if (results.length) {
          resolve(results[0]);
        } else {
          // If no product with the given ID is found, return null
          resolve(null);
        }
      }

      // close the database connection
      connection.end();
    });
  });
}

router.get("/edit", (req,res) => {
  res.render('pages/editPet', {
    title: 'Editar Pet',
    style: 'editPet.css',
    script: 'editPet.js',
    script2: 'shopBagConfig.js'
  });
})



router.post("/add-to-cart", async (req, res) => {
  // Extract token from authorization header
  const authHeader = req.headers.authorization

  if (!authHeader) {
      return res.status(401).json({
          msg: 'Faça o login primeiro'
      });
  }

  const tokens = authHeader;

  const token = tokens.split('token=')[1];

  let userId;
  try {
      const decodedToken = jwt.decode(token, process.env.SECRET)
      userId = decodedToken.id;
  } catch (error) {
    return res.status(401).json({
      msg: 'Invalido'
  });
  }
  
  // Extract product details from request body
  const productId = req.body.productId;
  const productImg = req.body.productImg;
  const productName = req.body.productName;
  const price = req.body.price;

  const pool = mysql2.createPool(process.env.DATABASE_URL);

  pool.getConnection((error, connection) => {
      if (error) {
          console.error('Error connecting to database:', error);
          res.status(500).send('Error connecting to database');
          return;
      }

      const query = util.promisify(connection.query).bind(connection);

      (async () => {
          try {
              // Check if the item already exists in the cart
              const [existingItem] = await query("SELECT id, quantity FROM cart_items WHERE user_id = ? AND product_id = ?", [userId, productId]);

              if (existingItem) {
                // Item already exists, update its quantity
                const newQuantity = existingItem.quantity + 1;
                await query("UPDATE bag_items SET quantity = ? WHERE id = ?", [newQuantity, existingItem.id]);
                connection.release();
                res.send("Product added to cart successfully!");
              } else {
                // Item does not exist, add it to the cart
                await query("INSERT INTO bag_items (user_id, product_id, product_name, price, quantity, image_path) VALUES (?, ?, ?, ?, ?, ?)", [userId, productId, productName, price, 1, productImg]);
                connection.release();
                res.send("Product added to cart successfully!");
              }

          } catch (error) {
              console.error('Error adding product to cart:', error);
              res.status(500).send('Error adding product to cart');
          }
      })();
  });
});

router.delete("/remove-from-cart/:productId", async (req, res) => {
  // Extract token from authorization header
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      msg: "Authorization header is missing",
    });
  }

  const tokens = authHeader;
  const token = tokens.split("token=")[1];

  let userId;
  try {
    const decodedToken = jwt.decode(token, process.env.SECRET);
    userId = decodedToken.id;
  } catch (error) {
    return res.status(401).json({
      msg: "Invalid token",
    });
  }

  const productId = req.params.productId;

  console.log(productId)
  console.log(userId)

  const pool = mysql2.createPool(process.env.DATABASE_URL);

  pool.getConnection((error, connection) => {
    if (error) {
      console.error("Error connecting to database:", error);
      res.status(500).send("Error connecting to database");
      return;
    }

    const query = util.promisify(connection.query).bind(connection);

    (async () => {
      try {
        // execute the query to remove the product from the cart
        await query(
          "DELETE FROM bag_items WHERE user_id = ? AND product_id = ?",
          [userId, productId]
        );
      
        // execute the query to get the updated bag items
        const [bagItems] = await query(
          "SELECT * FROM bag_items WHERE user_id = ?",
          [userId]
        );
      
        // release the connection back to the pool
        connection.release();
      
        res.json({
          msg: "Product removed from cart successfully!",
          bagItems,
        });
        
        // Update the cart table with the updated bag items
        renderCartTable(bagItems);
      
      } catch (error) {
        console.error("Error removing product from cart:", error);
        res.status(500).send("Error removing product from cart");
      }
    })();
  });
});






router.post('/open-cart', async (req, res) => {
  // Extract token from authorization header
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      msg: 'Faça o login primeiro',
    });
  }

  const tokens = authHeader;
  const token = tokens.split('token=')[1];

  let userId;
  try {
    const decodedToken = jwt.decode(token, process.env.SECRET);
    userId = decodedToken.id;
  } catch (error) {
    return res.status(401).json({
      msg: 'Faça o login primeiro',
    });
  }

  const pool = mysql.createPool(process.env.DATABASE_URL);

  try {
    // Execute the query using the pool
    const [data] = await pool.query('SELECT * FROM bag_items WHERE user_id = ?', [userId]);

    // Render the page with the products, categories, and pagination links
    res.render('pages/cart', {
      bagItems: data,
      layout: false
    });

  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).send('Internal server error');
  } finally {
    // Release the pool when the query is complete
    pool.end();
  }
});



router.post('/checkout', async (req, res) => {
  // Extract token from authorization header
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      msg: 'Faça o login primeiro',
    });
  }

  const tokens = authHeader;
  const token = tokens.split('token=')[1];

  let userId, userEmail;
  try {
    const decodedToken = jwt.decode(token, process.env.SECRET);
    userId = decodedToken.id;
    userEmail = decodedToken.email;
  } catch (error) {
    return res.status(401).json({
      msg: 'Faça o login primeiro',
    });
  }

  // Extract the total price from the request body
  const totalElem = req.body.totalElem;
  const total = 39.24;

  // Set up the PayPal SDK and create the payment request
  paypal.configure({
    mode: 'sandbox', // sandbox or live
    client_id: process.env.PAYPAL_CLIENT_ID,
    client_secret: process.env.PAYPAL_CLIENT_SECRET
  });

  const emailPass = process.env.EMAIL_PASSWORD
  const email = userEmail;

  // Insert the order into the database
  const pool = mysql2.createPool(process.env.DATABASE_URL);
  pool.getConnection((error, connection) => {
    if (error) {
      console.error('Error connecting to database:', error);
      res.status(500).send('Error connecting to database');
      return;
    }

    const query = util.promisify(connection.query).bind(connection);

    (async () => {
      try {
        // Insert the new order into the database
        const result = await query('INSERT INTO orders (user_id, total_price, order_date) VALUES (?, ?, NOW())', [userId, total]);

        // Release the connection back to the pool
        connection.release();

        // Create a PayPal order
        const request = new paypal.order.OrdersCreateRequest();
        request.prefer("return=representation");
        request.requestBody({
          intent: 'CAPTURE',
          purchase_units: [{
            amount: {
              currency_code: 'BRL',
              value: total.toString()
            }
          }]
        });

        // Call the PayPal API to create the order
        const response = await paypal.client().execute(request);

        // Get the approval link from the response
        const approvalLink = response.result.links.find(link => link.rel === 'approve').href;

        // Redirect the user to the PayPal payment page
        res.redirect(approvalLink);
      } catch (error) {
        console.error('Error inserting order into database or creating PayPal order:', error);
        res.status(500).send('Error inserting order into database or creating PayPal order');
      }
    })();
  });
});





export default router;