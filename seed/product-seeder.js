var Product = require('../models/product');
var mongoose = require('mongoose');
var assert = require('assert');
mongoose.connect('localhost:27017/shopping');

var products = [
	new Product({
		imagePath: 'http://www.thumbnailtemplates.com/images/thumbs/thumb-072-cod-black-ops-3-multiplayer-2.jpg',
		title: 'Call Of Duty- BlackOps',
		description: 'Get yourself ready for the ultimate battle because COD BlackOps is out peasants',
		price: 10
	}),
	new Product({
		imagePath: 'http://www.thumbnailtemplates.com/images/thumbs/thumb-064-grand-theft-auto-5-3.jpg',
		title: 'Grand Theft Auto- Five',
		description: 'Get yourself ready for the ultimate battle because GTA Five is out peasants',
		price: 12
	}),
	new Product({
		imagePath: 'https://images-eu.ssl-images-amazon.com/images/G/31/img15/Shoes/CatNav/k._V293117556_.jpg',
		title: 'Vans casual wears',
		description: 'Buy your feets some coziness with these Vans casual wears',
		price: 17
	}),
	new Product({
		imagePath: 'https://assetscdn.paytm.com/images/catalog/product/P/PH/PHILIPS_QT4011_NULL_NULL_272/19.jpg',
		title: 'Philips black trimmer',
		description: 'Groom yourself with this ultimate trimmer brought to you by Philips',
		price: 16
	}),
	new Product({
		imagePath: 'http://g.nordstromimage.com/ImageGallery/store/product/Zoom/15/_12810455.jpg',
		title: 'Nike bagpack',
		description: 'Get yourself ready for new journies as this Nike bagpack will carry all the stuff you need for an ultimate journey',
		price: 19
	}),
	new Product({
		imagePath: 'https://static.bhphotovideo.com/explora/sites/default/files/Adv-set.jpg',
		title: 'Yamaha home entertainment system',
		description: 'Amaze your friends by inviting them for a movie because this Yamaha home entertainment system is gonna blow their mind',
		price: 75
	}) 
];

var check = 0;
for(var i=0; i<products.length; i++)
{
	products[i].save(function(error, result) {
		assert.equal(null, error);
		console.log(result);
		++check;
		if(check === products.length)
		{
			disconnect();
		}
	});
}

function disconnect()
{
	mongoose.disconnect();
}

