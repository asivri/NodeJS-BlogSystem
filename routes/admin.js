var express = require('express');
var router = express.Router();

var passport= require('passport');
var localStrategy= require('passport-local').Strategy;
var flash = require('connect-flash');
var expressSession= require('express-session');


var Admin = require('../models/admin');

var inFun = false;

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/login', function(req, res, next) {
  res.render('login');
});


passport.serializeUser(function(admin, done) {
    done(null, admin.id);
});

passport.deserializeUser(function(id, done) {
    Admin.getUserById(id, function(err, admin) {
        done(err, admin);
    });
});

router.use(flash());
router.use(expressSession({
    secret: 'secret key',
    resave: false,
    saveUninitialized: true,
}));


router.post('/login',
    passport.authenticate('local', {
        failureRedirect:'/admin/login',
        failureFlash:"Invalid Username or Password!",
        inFun: true
    }),

    function(req, res) {
        req.flash('success', 'Now logged in!');
        res.redirect('/');
    });

if(inFun == true)
{
    console.log('In the function');
}



passport.use(new localStrategy(function (email, password, done) {
    Admin.getUserByEmail(email, function ( err, admin) {
        if(err) throw err;
        if(!admin)
        {
            return done(null, false, {message: 'Admin does not exist!'});
        }

        Admin.comparePassword(password, admin.password, function(err, isMatch){
            if(err) return done(err);
            if(isMatch)
            {
                return done(null, admin);
            }
            else
                return done(null, false, {message: 'Invalid Password'});
        });
    })
}));

module.exports = router;
