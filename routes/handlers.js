import express from 'express';
import multer from 'multer';
import {
  multerConfig,
  uploadAvatar
} from '../config/multer.js';
import pool from '../config/db.js';
import { getUserFromToken, requireLogin } from '../config/auth.js';
// Models
import {
  User
} from '../models/User.js';
import bcrypt from 'bcrypt';
import paypal from 'paypal-rest-sdk';


const router = express.Router();

// routing
router.get('/', (req, res) => {
  res.render('pages/home', {
    title: 'Página Inicial | Coleiras Amorosas',
    style: 'home.css',
    script: 'home.js',
    script2: 'shopBagConfig.js',
    script3: 'login.js',
  });
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

  try {
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

    await User.create(name, email, cpf, tel, passwordHash);
    res.redirect('../login');
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({
      msg: 'Ocasionou um erro, tente novamente'
    })
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
    let products, totalCount;

    if (category === 'all') {
      // Query all products if filter category is 'all'
      [products] = await pool.query(
        `SELECT * FROM products WHERE productName LIKE ? ORDER BY id LIMIT ? OFFSET ?`,
        [`%${search}%`, perPage, offset]
      );

      [[totalCount]] = await pool.query(
        `SELECT COUNT(*) AS count FROM products WHERE productName LIKE ?`,
        [`%${search}%`]
      );
    } else {
      // Query products by category if filter category is not 'all'
      [products] = await pool.query(
        `SELECT * FROM products WHERE category = ? AND productName LIKE ? ORDER BY id LIMIT ? OFFSET ?`,
        [category, `%${search}%`, perPage, offset]
      );

      [[totalCount]] = await pool.query(
        `SELECT COUNT(*) AS count FROM products WHERE category = ? AND productName LIKE ?`,
        [category, `%${search}%`]
      );
    }

    // Generate filter options for categories
    const [categories] = await pool.query(
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
    res.status(500).send('Error executing query');
  }
});


router.get('/adoption', async (req, res) => {
  // read the query parameters
  const page = parseInt(req.query.page || '1') || 1;
  const breed = req.query.breed || '';
  const type = req.query.type || '';

  // calculate the offset and limit for pagination
  const limit = 2;
  const offset = (page - 1) * limit;

  try {
    // execute the query with filters and pagination
    const [[pets], [totalCount], [breeds]] = await Promise.all([
      pool.query(
        `SELECT * FROM pets WHERE breed LIKE ? AND type LIKE ? LIMIT ? OFFSET ?`,
        [`%${breed}%`, `%${type}%`, limit, offset]
      ),
      pool.query(
        `SELECT COUNT(*) AS count FROM pets WHERE breed LIKE ? AND type LIKE ?`,
        [`%${breed}%`, `%${type}%`]
      ),
      pool.query(`SELECT DISTINCT breed FROM pets`),
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
    res.status(500).send('Error executing query');
  }
});


router.post('/submit-pet-form', requireLogin, multer(multerConfig).single('input-pet-img'), async (req, res) => {
  if (!req.file) {
    return res.status(422).send('A imagem do pet é obrigatória.');
  }

  // handle form submission here
  const petName = req.body.petName;
  const petAge = req.body.petAge;
  const petType = req.body.petType;
  const petBreed = req.body.petBreed;
  const petPhoneNumber = req.body.phoneNumber;
  const petsInfo = req.body.petInfo;
  const imagePath = '../images/pets/users/' + req.file.filename;

  try {
    const sql = `INSERT INTO pets (name, age, type, breed, image_path, phoneNumber, petInfo) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const values = [petName, petAge, petType, petBreed, imagePath, petPhoneNumber, petsInfo];
    await pool.query(sql, values);
    res.redirect('/adoption');
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).send('Erro ao cadastrar o pet');
  }
});


router.post('/user/avatar', uploadAvatar.single('avatar'), async (req, res) => {
  const decoded = getUserFromToken(req);
  if (!decoded) {
    return res.status(401).json({ msg: 'Faça o login primeiro' });
  }
  if (!req.file) {
    return res.status(422).json({ msg: 'Envie uma imagem' });
  }

  try {
    const user = await User.getById(decoded.id);
    if (!user) {
      return res.status(404).json({ msg: 'Usuário não encontrado' });
    }

    const imageAvatar = '../images/user/avatar/' + req.file.filename;
    await User.updateAvatar(user.id, imageAvatar);

    res.status(200).json({ msg: 'Avatar atualizado com sucesso' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro do servidor');
  }
});

router.get('/product/:id', async function(req, res) {
  try {
    // Query the database for the product information
    const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
    const product = rows[0];

    if (!product) {
      return res.status(404).send('Produto não encontrado');
    }

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

router.get("/edit", (req,res) => {
  res.render('pages/editPet', {
    title: 'Editar Pet',
    style: 'editPet.css',
    script: 'editPet.js',
    script2: 'shopBagConfig.js'
  });
})


router.post("/add-to-cart", async (req, res) => {
  const decoded = getUserFromToken(req);
  if (!decoded) {
    return res.status(401).json({
      msg: 'Faça o login primeiro'
    });
  }
  const userId = decoded.id;

  // Extract product details from request body
  const { productId, productImg, productName, price } = req.body;

  try {
    // Check if the item already exists in the cart
    const [[existingItem]] = await pool.query(
      "SELECT id, quantity FROM bag_items WHERE user_id = ? AND product_id = ?",
      [userId, productId]
    );

    if (existingItem) {
      // Item already exists, update its quantity
      await pool.query("UPDATE bag_items SET quantity = ? WHERE id = ?", [existingItem.quantity + 1, existingItem.id]);
    } else {
      // Item does not exist, add it to the cart
      await pool.query(
        "INSERT INTO bag_items (user_id, product_id, product_name, price, quantity, image_path) VALUES (?, ?, ?, ?, ?, ?)",
        [userId, productId, productName, price, 1, productImg]
      );
    }

    res.json({ msg: "Produto adicionado ao carrinho!" });
  } catch (error) {
    console.error('Error adding product to cart:', error);
    res.status(500).json({ msg: 'Erro ao adicionar produto ao carrinho' });
  }
});

router.delete("/remove-from-cart/:productId", async (req, res) => {
  const decoded = getUserFromToken(req);
  if (!decoded) {
    return res.status(401).json({
      msg: "Faça o login primeiro",
    });
  }
  const userId = decoded.id;
  const productId = req.params.productId;

  try {
    // execute the query to remove the product from the cart
    await pool.query(
      "DELETE FROM bag_items WHERE user_id = ? AND product_id = ?",
      [userId, productId]
    );

    // execute the query to get the updated bag items
    const [bagItems] = await pool.query(
      "SELECT * FROM bag_items WHERE user_id = ?",
      [userId]
    );

    res.json({
      msg: "Product removed from cart successfully!",
      bagItems,
    });
  } catch (error) {
    console.error("Error removing product from cart:", error);
    res.status(500).send("Error removing product from cart");
  }
});


router.post('/open-cart', async (req, res) => {
  const decoded = getUserFromToken(req);
  if (!decoded) {
    return res.status(401).json({
      msg: 'Faça o login primeiro',
    });
  }

  try {
    const [data] = await pool.query('SELECT * FROM bag_items WHERE user_id = ?', [decoded.id]);

    res.render('pages/cart', {
      bagItems: data,
      layout: false
    });
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).json({ msg: 'Erro ao carregar o carrinho' });
  }
});


// Set up the PayPal SDK
paypal.configure({
  mode: 'sandbox', // sandbox or live
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_CLIENT_SECRET
});

router.post('/checkout', async (req, res) => {
  const decoded = getUserFromToken(req);
  if (!decoded) {
    return res.status(401).json({
      msg: 'Faça o login primeiro',
    });
  }
  const userId = decoded.id;

  try {
    // Calculate the total from the items in the user's bag
    const [[{ total }]] = await pool.query(
      'SELECT COALESCE(SUM(price * quantity), 0) AS total FROM bag_items WHERE user_id = ?',
      [userId]
    );
    const totalValue = Number(total).toFixed(2);

    if (Number(totalValue) <= 0) {
      return res.status(422).json({ msg: 'Seu carrinho está vazio' });
    }

    // Insert the new order into the database
    await pool.query('INSERT INTO orders (user_id, total_price, order_date) VALUES (?, ?, NOW())', [userId, totalValue]);

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const payment = {
      intent: 'sale',
      payer: { payment_method: 'paypal' },
      redirect_urls: {
        return_url: `${baseUrl}/`,
        cancel_url: `${baseUrl}/shop`
      },
      transactions: [{
        amount: { currency: 'BRL', total: totalValue },
        description: 'Compra Coleiras Amorosas'
      }]
    };

    paypal.payment.create(payment, (error, createdPayment) => {
      if (error) {
        console.error('Error creating PayPal payment:', error);
        return res.status(500).send('Erro ao criar pagamento no PayPal');
      }

      // Send the approval link back to the browser
      const approvalLink = createdPayment.links.find(link => link.rel === 'approval_url').href;
      res.send(approvalLink);
    });
  } catch (error) {
    console.error('Error inserting order into database:', error);
    res.status(500).send('Erro ao registrar o pedido');
  }
});


export default router;
