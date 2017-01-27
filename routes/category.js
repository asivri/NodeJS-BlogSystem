/**
 * Created by Ahmet on 1/27/2017.
 */
var express = require('express');
var router = express.Router();
var mongoDB = require('mongodb');
var db = require('monk')('localhost/blogSystem');

router.get('/:category', function (req, res, next) {
    var posts = db.get('posts');
    //TODO: Fix the category view
    posts.find({category: req.params.category}, {}, function (err, posts){
        res.render('index',{
            'title': req.params.category,
            'posts': posts
        });
        console.log(category);
    });
});

router.get('/add', function (req, res, next) {
    res.render('addCategory');
});

router.post('/add', function(req, res, next)
{
    var name = req.body.name;

    req.checkBody('category', 'Please type the required fields!');

    var errors = req.validationErrors();

    if(!errors)
    {
        var categories = db.get('categories');
        categories.insert({
            "name": name
        }, function (err, categories) {
            if(err)
            {
                throw err;
            }
            else
            {
                req.flash('success', 'The Category Added');
                res.location('/');
                res.redirect('/'); //TODO: Change the redirect address.
            }
        });
    }
});

module.exports = router;