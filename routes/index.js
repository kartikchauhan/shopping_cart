var express = require('express');
var router = express.Router();
var assert = require('assert');
var passport = require('passport');

var Product = require('../models/product');
var Cart = require('../models/cart');
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
		console.log(req.session.cart);
		res.redirect('/');
	});
});

module.exports = router;
