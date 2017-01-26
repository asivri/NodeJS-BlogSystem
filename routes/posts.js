/**
 * Created by Ahmet on 1/26/2017.
 */
var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({dest: './images'});

router.get('/add', function (req, res, next) {
    res.render('addPost');
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
