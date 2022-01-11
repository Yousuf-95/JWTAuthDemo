const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Define a user schema
const userSchema = new Schema({
    username: String,
    password: String
});
//Enter data in 'User' collection
module.exports = mongoose.model('User',userSchema);
