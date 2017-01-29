/**
 * Created by Ahmet on 1/26/2017.
 */
var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({dest: './public/images'});
var mongoDB = require('mongodb');
var db = require('monk')('localhost/blogSystem');



router.get('/', function (req, res, next) {
    var categories = db.get('categories');

    categories.find({}, {}, function (err, categories){
        {
            res.render('panel',{
                'categories': categories
            });
        }
    });

});

router.get('/', function(req, res, next){
    var posts = db.get('posts');
    posts.find({}, {}, function (err, posts) {
        res.render({ posts: posts});
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

module.exports = router;
