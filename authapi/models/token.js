const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Define a token schema
const tokenSchema = new Schema({
    refreshToken: String,
    user: String
});
//Enter data in 'token' collection
module.exports = mongoose.model('Token',tokenSchema);