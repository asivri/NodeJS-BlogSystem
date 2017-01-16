/**
 * Created by Ahmet on 1/16/2017.
 */

var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');


mongoose.connect('mongodb://localhost/blogSystem');

var db = mongoose.connection;

var userSchema = mongoose.Schema({
    email:{
        type:String
    },
    password:{
        type:String
    }
});

var Admin = module.exports = mongoose.model('Admin', userSchema);

module.exports.getUserById= function(id, callback){
    Admin.findById(id, callback);
};

module.exports.getUserByEmail=function (email, callback) {
    var query ={email: email};
    Admin.findOne(query, callback);
};

module.exports.comparePassword = function (candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
        callback(null, isMatch);
    });
};
