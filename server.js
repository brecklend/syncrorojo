var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app = express();

app.get('/syncrorojo', function(req, res) {
	//get array of city links within search states
	//get listings for each city
	//filter listings
	//write to json file

	//For development, get cl pages and host them locally
	//var url = 'http://localhost/cl/sites';

	var url = 'http://localhost/cl/sites.html';

	request(url, function(error, response, html) {
		if(!error) {
			var $ = cheerio.load(html);

			$('h1 a[name=US]').filter(function() {
				var data = $(this).parent(); //<h1><a name="US"></a>US</h1>
				var divcolmask = data.siblings('.colmask').first(); //<div class="colmask">
				var divbox = divcolmask.children('.box'); //<div class="box box_1">

				var state = $('h4:contains("Alaska")');
				var cities = $(state).next('ul').children();

				//console.log($(alaskanCities).html());

				$(cities).each(function(ind, ele) {
					var link = $(this).find('a').attr('href').replace('//', 'http://');
					var cityName = $(this).text();
					console.log(cityName + ': ' + link);
				});
			});

			res.send('Check your console!');
		}
		else {
			console.log('error');
		}
	});
});

app.listen('8081');
console.log('port 8081');
exports = module.exports = app;