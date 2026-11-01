// Imports
import express from 'express';
import dotenv from 'dotenv';
import exphbs from 'express-handlebars';
import cookieParser from 'cookie-parser';
import router from './routes/handlers.js';
import routers from './routes/loginRoutes.js';


// .env configuration
dotenv.config();

const PORT = process.env.PORT || 5500;

// Express middleware
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));

// Set up the Handlebars template engine
app.engine('handlebars', exphbs.engine({defaultLayout: 'structure'}));
app.set('view engine', 'handlebars');

// use the router middleware
app.use(router);
app.use(routers);

// Open Route - Public Route
app.get('/api', (req, res) => {
  res.status(200).json({ msg: "Bem vindo a nossa API!" })
});

// Error handler (multer errors, unexpected errors)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ msg: err.message || 'Erro do servidor' });
});

// Log errors instead of letting them kill the server
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason);
});


const server = app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});

process.on('SIGTERM', () => {
  console.info('SIGTERM signal received.');
  console.log('Closing server...');
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
});
