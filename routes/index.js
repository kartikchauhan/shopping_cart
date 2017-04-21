var express = require('express');
var router = express.Router();
var assert = require('assert');
var csrf = require('csurf');
var passport = require('passport');

var Product = require('../models/product');

var csrfProtection = csrf();
router.use(csrfProtection);

router.get('/', function(req, res, next) {
	Product.find(function(error, docs) {
		var chunkSize = 3;
		var products = [];
		for(var i=0; i<docs.length; i += chunkSize)
		{
			products.push(docs.slice(i, i+chunkSize));
		}
  		res.render('shop/index', { title: 'Shopping Cart', products: products });
	});
});

router.get('/user/signup', function(req, res, next) {
	var messages = req.flash('error');
	res.render('user/signup', {csrfToken: req.csrfToken(), messages: messages, hasError: messages.length > 0});
});

router.get('/user/profile', function(req, res, next) {
	res.render('user/profile');
});

router.post('/user/signup', passport.authenticate('local.signup', {
	successRedirect: '/user/profile',
	failureRedirect: '/user/signup',
	failureFlash : true
}));

module.exports = router;
