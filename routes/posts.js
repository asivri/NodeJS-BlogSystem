/**
 * Created by Ahmet on 1/26/2017.
 */
var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({dest: './public/images'});
var mongoDB = require('mongodb');
var db = require('monk')('localhost/blogSystem');
//var quill = require('quill'); //TODO: Implement it after CKEditor.
//var editor = new Quill('#editor');

router.get('/show/:id', function (req, res, next) {
    var posts = db.get('posts');

    posts.findById(req.params.id, function (err, post){
        {
            res.render('postDisplay',{
                'post': post
            });
        }
    })
});

router.get('/add', function (req, res, next) {
    var categories = db.get('categories');

    categories.find({}, {}, function (err, categories){
        {
            res.render('addPost',{
                'categories': categories
            });
        }
    })
});

router.post('/comment/add', function(req, res, next)
{
    var name = req.body.name;
    var email = req.body.email;
    var site = req.body.site;
    var body = req.body.body;
    var postId = req.body.postId;
    var commentDate = new Date();


    req.checkBody('name', 'Please type your name!').notEmpty();
    req.checkBody('body', 'Please type your comment!').notEmpty();

    var errors = req.validationErrors();

    if(!errors)
    {
        var comment = {
            "name": name,
            "email": email,
            "site": site,
            "body": body,
            "commentdate": commentDate
        }

        var posts = db.get('posts');

        posts.update({
            "_id": postId
        },
            {
                $push:{
                    "comments": comment
                }
            }, function (err, post) {
            if(err)
            {
                throw err;
            }
            else
            {
                req.flash('success', 'Your Comment Added!');
                res.location('/posts/show/'+postId);
                res.redirect('/posts/show/'+postId);
            }
        });
    }
    else
    {
        var posts = db.get('posts');
        posts.findById(postId, function (err, post) {
            res.render('postDisplay',{
                "errors": errors,
                "post": post
            });
        });
    }

    console.log(req.body.name);
    console.log(req.body.body);
});

module.exports = router;
