/**
 * Created by Ahmet on 1/27/2017.
 */
var express = require('express');
var router = express.Router();
var mongoDB = require('mongodb');
var db = require('monk')('localhost/blogSystem');

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