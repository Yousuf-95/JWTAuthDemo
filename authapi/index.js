const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
// const randToken = require('rand-token');
const { createToken, verifyToken, getRefreshToken } = require('./util');
const User = require('./models/user');
const Token = require('./models/token');

const csrfProtection = csrf({
    cookie: true
});

const app = express();

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization,X-CSRF-TOKEN');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    // res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.post('/login/auth', async (req, res) => {
    console.log(req.body);

    //create new token
    const token = createToken(req.body.username);

    //Get token expiry time by decoding token
    const decodedToken = jwt.decode(token);
    const expiresAt = decodedToken.exp;
    // console.table(decodedToken);

    // Get a refresh token
    const refreshToken = getRefreshToken();

    //Save refresh token & username to mongoDB
    const saveRefreshToken = new Token({
        refreshToken,
        user: decodedToken.username
    });
    await saveRefreshToken.save();

    //set refresh token cookie
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true
    });

    //set jwt cookie
    res.cookie('token', token, {
        httpOnly: true
    });

    res.json({
        token,
        expiresAt
        // username: decodedToken.username
    });
});


// Add user to database
// app.post('/api/adduser', (req,res) => {
//     const {username,password} =  req.body;
//     bcrypt.hash(password, 12)
//     .then(hashedPassword => {
//         const myUser = new user({
//             username,
//             password: hashedPassword
//         });

//         return myUser.save();
//     })
//     .then(result => {
//             res.status(200).json(result);
//      })
//     .catch(error => {
//         console.log(error)
//     });

// });

app.get('/api/token/refresh', async (req, res) => {
    const {refreshToken} = req.cookies;

    const userFromToken = await Token.findOne({
        refreshToken
    }).select('user');
    // console.log('userFromToken: ' + userFromToken.user);
    const user = await User.findOne({
        username: userFromToken.user
    });
    // console.log('user: ' + user.username);
    
    const token = createToken(user);
    const decodedToken = jwt.decode(token);
    const expiresAt = decodedToken.exp;

    res.cookie('token', token, {
        httpOnly: true
    });

    res.json({token,expiresAt});
});


app.use(csrfProtection);
app.get('/api/csrf-protection', (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});

app.post('/api/adduser', verifyToken, async (req, res) => {
    const { username, password } = req.body;
    // console.log('Username: ' + username + 'Password: ' + password);
    try {
        const hashedPassword = await bcrypt.hash(password, 12);
        const myUser = new User({
            username,
            password: hashedPassword
        });

        const result = await myUser.save();

        res.status(200).json(result);
    }
    catch (error) {
        console.log(error);
    }
});

//GET users from database
// app.get('/users',async (req,res) => {
//     let result = await user.find({firstName: 'Ari'});
//     console.log(result);
//     res.status(200).send(result);
// });


//Connect to 'testApp' database on local machine
mongoose.connect('mongodb://localhost:27017/testApp');

//start node server
app.listen(4000, () => console.log('Server running on port 4000'));