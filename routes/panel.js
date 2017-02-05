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
var posts = db.get('posts');
var categories = db.get('categories');

router.get('/', function (req, res, next) {

    //var posts = db.get('posts');

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
        //var posts = db.get('posts');
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

router.post('/delete/post/:id', function(req, res, next)
{

    id = req.params.id;
    console.log("The id is" + id);
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



router.post('/edit/post', function(req, res, next)
{
    var post = {
        title : req.body.title,
        category : req.body.category,
        body : req.body.body
    };

    var id= req.body.id;
    posts.updateById(id, post);
});

router.post('/delete/category', function(req, res, next)
{
    id = req.params.id;
    console.log("Hello console");
    console.log(id);
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
