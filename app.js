// Imports
import express from 'express';
import dotenv from 'dotenv';
import exphbs from 'express-handlebars';
import router from './routes/handlers.js';
import routers from './routes/loginRoutes.js';
import bodyParser from 'body-parser';


// .env configuration
dotenv.config();

// Express middleware
const app = express();
app.use(express.json())
app.use(express.static('public'));

// Body Parser middleware
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json())


// use the router middleware
app.use(router);
app.use(routers);

// Set up the Handlebars template engine
app.engine('handlebars', exphbs.engine({defaultLayout: 'structure'}));
app.set('view engine', 'handlebars');

// Open Route - Public Route
app.get('/api', (req, res) => {
  res.status(200).json({ msg: "Bem vindo a nossa API!" })
});

app.listen(5500, () => {
  console.log("App is listening");
});








