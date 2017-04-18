var express = require('express');
var router = express.Router();
var Product = require('../models/product');
var assert = require('assert');

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

module.exports = router;
