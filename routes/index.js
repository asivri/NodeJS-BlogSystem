var express = require('express');
var router = express.Router();
var mongoDB = require('mongodb');
var mongoose = require('mongoose');
var dbVar = mongoose.connection;
var db = require('monk')('localhost/articleDB');
/* GET home page. */


router.get('/',function(req, res, next) {
  var db = req.db;
  var posts = db.get('posts');
  posts.find({}, {}, function (err, posts) {
    res.render('index', { posts: posts});
  })
});

//TODO: This function will be implemented when the login problem solved
// function ensureAdmin(req, res, next) {
//   if(req.isAuthenticated()){
//     return next;
//   }
//   res.redirect('/admin/login');
// }


router.get('/panel', function(req, res) {
  res.render('panel');
});


module.exports = router;
