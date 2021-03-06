var express = require('express');
var router = express.Router();
var assert = require('assert');
var passport = require('passport');

var Product = require('../models/product');
var Cart = require('../models/cart');
var Order = require('../models/order');

router.get('/', function(req, res, next) {

	var successMsg = req.flash('success')[0];
	Product.find(function(error, docs) {
		var chunkSize = 3;
		var products = [];
		for(var i=0; i<docs.length; i += chunkSize)
		{
			products.push(docs.slice(i, i+chunkSize));
		}
  		res.render('shop/index', { title: 'Shopping Cart', products: products, successMsg: successMsg, noMsg: !successMsg });
	});	
});

router.get('/add-to-cart/:id', function(req, res, next) {
	var productId = req.params.id;
	var cart = new Cart(req.session.cart ? req.session.cart : {});
	Product.findById(productId, function(err, product) {
		if(err)
		{
			return res.redirect('/');
		}
		cart.add(product, product.id);
		req.session.cart = cart;
		res.redirect('/');
	});
});

router.get('/reduce/:id', function(req, res, next) {
	var productId = req.params.id;
	var cart = new Cart(req.session.cart ? req.session.cart : {});
	cart.reduceByOne(productId);
	req.session.cart = cart;
	res.redirect('/shopping-cart/');
});

router.get('/remove/:id', function(req, res, next) {
	var productId = req.params.id;
	var cart = new Cart(req.session.cart ? req.session.cart : {});
	cart.remove(productId);
	req.session.cart = cart;
	res.redirect('/shopping-cart/');
});

router.get('/shopping-cart/', function(req, res, next) {
	if(!req.session.cart)
	{
		return res.render('shop/shopping-cart', {products: null});
	}
	var cart = new Cart(req.session.cart);
	res.render('shop/shopping-cart', {products: cart.generateArray(), totalPrice: cart.totalPrice});

});

router.get('/checkout', isLoggedIn, function(req, res, next) {
	if(!req.session.cart)
	{
		return res.redirect('/shopping-cart');
	}
	var cart = new Cart(req.session.cart);
	var errMsg = req.flash('error')[0];
	res.render('shop/checkout', {totalPrice: cart.totalPrice, errMsg: errMsg, noError: !errMsg});
});

router.post('/checkout', function(req, res, next) {
	if(!req.session.cart)
	{
		return res.redirect('/shopping-cart');
	}
	var cart = new Cart(req.session.cart);

	var stripe = require("stripe")(
	  	"sk_test_3fMEErbX3cilua709xH57qI6"
	);
	stripe.charges.create({
	  	amount: cart.totalPrice * 100,
	  	currency: "usd",
	  	source: req.body.stripeToken, // obtained with Stripe.js
	  	description: "Test customer charging"
	}, function(err, charge) {
		var order = new Order({
			user: req.user,
			cart: req.session.cart,
			name: req.body.name,
			address: req.body.address,
			paymentId: charge.id
		});
		order.save(function(err, result) {
			if(err)
			{
				req.flash('error', err.message);
	  			return res.redirect('/checkout');
			}
		});
	  	if(err)
	  	{
	  		req.flash('error', err.message);
	  		return res.redirect('/checkout');
	  	}
	  	req.flash('success', 'Payment Successful');
	  	req.session.cart = null;
	  	res.redirect('/');
	});
});

module.exports = router;

function isLoggedIn(req, res, next)
{
	if(req.isAuthenticated())
		return next();
	req.session.oldUrl = req.url;
	res.redirect('/user/signin');
}