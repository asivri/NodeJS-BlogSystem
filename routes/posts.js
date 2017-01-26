/**
 * Created by Ahmet on 1/26/2017.
 */
var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({dest: './images'});
var mongoDB = require('mongodb');
var db = require('monk')('localhost/blogSystem');
//var quill = require('quill'); //TODO: Implement it after CKEditor.
//var editor = new Quill('#editor');

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

    console.log(title);
    console.log(body);
    console.log(author);
    console.log(date);

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
