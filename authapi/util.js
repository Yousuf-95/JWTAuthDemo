const randToken = require('rand-token');
const jwt = require('jsonwebtoken');

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

const getRefreshToken = () => {
    return randToken.uid(64);
};

module.exports = {verifyToken, getRefreshToken};