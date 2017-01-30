/**
 * Created by Ahmet on 1/26/2017.
 */
var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({dest: './public/images'});
var mongoDB = require('mongodb');
var db = require('monk')('localhost/blogSystem');
const monk = require('monk');
// var mongoose = require('mongoose');
// // mongoose.connect('mongodb://localhost/blogSystem');
// var Schema = mongoose.Schema;
// // var database = mongoose.connection;
//
// var postSchema =Schema({
//     title:{
//         type: String
//     },
//     body: {
//         type: String
//     },
//     "postImage":{
//         data: Buffer,
//         type: String
//     },
//     "category":{
//         type: String
//     },
//     "author":{
//         type: String
//     }
// }, {collection: 'post'});
//
// var PostAdmin = module.exports = mongoose.model('PostAdmin', postSchema);

router.get('/', function (req, res, next) {
    var categories = db.get('categories');
    var posts = db.get('posts');

    categories.find({}, {}, function (err, categories){
        {
            posts.find({}, {}, function (err, posts) {
                res.render('panel', {
                    'posts': posts,
                    'categories': categories
                });
                console.log(err);
            });
        }
    });
});



router.post('/add', upload.single('postImage'), function(req, res, next)
{
    var title = req.body.title;
    var category = req.body.category;
    var body = req.body.body;
    var author = req.body.author;
    var date = new Date();

    if(req.file)
    {
        var postImage = req.file.filename;
    }

    req.checkBody('title', 'Please type the required fields!');
    req.checkBody('body', 'Please type the required fields!');

    var errors = req.validationErrors();

    if(!errors)
    {
        var posts = db.get('posts');
        posts.insert({
                "title": title,
                "body": body,
                "postImage": postImage,
                "category": category,
                "author": author
        }, function (err, post) {
            if(err)
            {
                throw err;
            }
            else
            {
                req.flash('success', 'The Post Added');
                res.location('/');
                res.redirect('/'); //TODO: Change the redirect address.
            }
        });
    }
});

router.post('/delete', function(req, res, next)
{
    var posts = db.get('posts');
    id = req.body.id;
    posts.findOneAndDelete(id, function (err, post) {
        if(err)
        {
            console.log(err);
        }
        else {
            res.location('/');
            res.redirect('/');
        }
    });

});



module.exports = router;
