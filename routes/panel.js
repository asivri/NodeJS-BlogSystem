/**
 * Created by Ahmet on 1/26/2017.
 */
var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.render('panel');
});


module.exports = router;
