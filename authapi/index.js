const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');


const Schema = mongoose.Schema;

//Define a user schema
const userSchema = new Schema({
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    address: {
        city: String,
        street: String,
        zipcode: String
    }
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


const verifyToken = (req,res,next) => {
    const token = req.get('Authorization').split(' ')[1];
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
    req.username = decodedToken.username;
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
    res.json({
        token,
        expiresAt
    });
});

// Add user to database
// app.post('/api/adduser', async (req,res) => {
//     const {firstName,lastName,email,phone,city,street,zipcode} =  req.body;
//     // const doc = req.body;
//     // console.log(doc);
//     // console.log(req.body);
//     const address = {
//         city,
//         street,
//         zipcode
//     };
    
//     const myUser = new user({
//         firstName,
//         lastName,
//         email,
//         phone,
//         address
//     });
    
//     let result = await myUser.save();
//     console.log(result);
    
//     res.send('success');
// });


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