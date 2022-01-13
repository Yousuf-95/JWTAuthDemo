const randToken = require('rand-token');
const jwt = require('jsonwebtoken');


const createToken = (username) => {
    if(!username){
        throw new Error('No username specified');
    }

    return jwt.sign({
        username
    },
    'somesupersecret',
    {expiresIn: '10s'}
    );
}

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
        // err.statusCode = 500;
        if(!decodedToken){
            // const error = new Error('Not Authenticated');
            // error.statusCode = 401;
            // throw error;
            return res.status(401).json({error: "JWT Expired"});
        }
        return next(err);
    }
    
    // req.username = decodedToken.username;
    next();
}

const getRefreshToken = () => {
    return randToken.uid(64);
};

module.exports = {createToken,verifyToken, getRefreshToken};