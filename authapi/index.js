const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
// const csrf = require('csurf');

// const csrfProtection = csrf({
//     cookie: true
// });

const Schema = mongoose.Schema;

//Define a user schema
const userSchema = new Schema({
    username: String,
    password: String
});


//Enter data in 'User' collection
const user = mongoose.model('User',userSchema);

const app = express();

app.use(function (req, res, next) {
    
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    // res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cookieParser());


const verifyToken = async (req,res,next) => {
    // const token = req.get('Authorization').split(' ')[1];
    
    //Getting token from the cookie
    const token = req.cookies.token;
    
    
    // console.log(token);
    // console.log(req.body.username, req.body.password);
    let decodedToken;
    try{
        decodedToken = jwt.verify(token,'somesupersecret');
    }
    catch (err) {
        err.statusCode = 500;
        throw err;
    }
    if(!decodedToken){
        const error = new Error('Not Authenticated');
        error.statusCode = 401;
        throw error;
    }
    // req.username = decodedToken.username;
    next();
}



app.post('/login/auth', (req,res) => {
    console.log(req.body);
    const token = jwt.sign(
        {
            username: req.body.username,
        },
        'somesupersecret',
        {expiresIn: '1h'}
        );
        
        const decodedToken = jwt.decode(token);
        const expiresAt = decodedToken.exp;
        // console.log(token);
        
        //setting cookie
        res.cookie('token',token, {
            httpOnly: true
        });

        res.json({
            token,
            expiresAt
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
        
        
    // app.use(csrfProtection);
    // app.get('/api/csrf-protection',(req,res) => {
    //     res.json({ csrfToken: req.csrfToken() });
    // });
        
    app.post('/api/adduser', verifyToken, async (req,res) => {
    const {username,password} = req.body;
    // console.log('Username: ' + username + 'Password: ' + password);
    try{
        const hashedPassword = await bcrypt.hash(password,12);
        const myUser = new user({
            username,
            password: hashedPassword
        });
        
        const result = await myUser.save();
    
        res.status(200).json(result);
    }
    catch(error){
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
app.listen(4000,() => console.log('Server running on port 4000'));