import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import jwt from 'jsonwebtoken'
import session from 'express-session';
// Models
import {
    User
} from '../models/User.js';
import bcrypt from 'bcrypt';
import cookieParser from 'cookie-parser';

const routers = express.Router();
const app = express();
app.use(cookieParser());
// set up session middleware
// app.use(session({
//     secret: 'mysecret', // replace with your own secret key
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//         maxAge: 3600000 // session will expire after 1 hour (in milliseconds)
//     }
// }));



app.use(express.static('public'));

app.set('views', path.join(new URL('.',
    import.meta.url).pathname, 'views'));

// app.use(bodyParser.urlencoded({
//     extended: true
// }));






// const verifyToken = async (req, res, next) => {
//     const token = req.cookies['token'];
//     if (!token) {
//       return res.status(401).json({
//         msg: 'Token não fornecido'
//       })
//     }
  
//     try {
//       const decoded = jwt.verify(token, process.env.SECRET)
//       const user = await User.findById(decoded.id)
//       if (!user) {
//         return res.status(404).json({
//           msg: 'Usuário não encontrado'
//         })
//       }
//       req.user = user
//       next()
//     } catch (err) {
//       return res.status(403).json({
//         msg: 'Token inválido'
//       })
//     }
//   }
  
//   routers.get('/profile', verifyToken, (req, res) => {
//     const user = req.user
//     // Your code goes here

//     if(!user) {
//         return res.status(404).json({msg: 'Usuário não encontrado'})
//     }

//     res.render('pages/signup', {
//         title: 'signup',
//         style: 'signup.css',
//         script: 'signup.js',
//         script2: 'shopBagConfig.js',
//       });
//   })
  


// routing
routers.get('/login', (req, res) => {
    res.render('pages/login', {
        title: 'Login',
        style: 'login.css',
        script: 'login.js',
        script2: 'shopBagConfig.js',
    });
});

// User
routers.post('/auth/login', async (req, res) => {
    const {
        email,
        password
    } = req.body

    // validation
    if (!email) {
        return res.status(422).json({
            msg: 'O email é obrigatório'
        })
    }
    if (!password) {
        return res.status(422).json({
            msg: 'A senha é obrigatória'
        })
    }

    // check if user exists
    const user = await User.getByEmail(email);

    if (!user) {
        return res.status(404).json({
            msg: 'Usuário não encontrado'
        })
    }

    // check if password match
    const checkPassword = await bcrypt.compare(password, user.password)

    if (!checkPassword) {
        return res.status(422).json({
            msg: 'Senha inválida'
        })
    }

    try {
        // Retrieve the secret value from environment variable
        const secret = process.env.SECRET;

        // Create a JWT token by signing it with the user's id and the hashed secret
        const token = jwt.sign({ id: user.id, email: user.email }, secret);

        // send token in the response header
        res.header('Authorization', 'Bearer ', token);

        // // set token as HttpOnly cookie
        res.cookie('token', token, {
            maxAge: 60 * 60 * 1000
        });
        res.status(200).json({
            msg: "Autenticação realizada com sucesso",
            token
        })
        // // Redirect to home page


    } catch (err) {
        console.log(err)
        res.status(500).json({
            msg: 'Aconteceu um erro no servidor, tente novamente mais tarde'
        })
    }
})








export default routers;