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

	var url = 'http://localhost:8081/sites.html';

	request(url, function(error, response, html) {
		if(!error) {
			var $ = cheerio.load(html);

			$('h1 a[name=US]').filter(function() {
				var data = $(this).parent();
				var divcolmask = data.siblings('.colmask').first();
				var divbox = divcolmask.children('.box');
				var h4ca = divbox.children('h4');

				$(divbox).each(function(i, ele) {
					console.log('State: ' + $(this).text());
				});
				// var container = data.find('h4').text() == 'Alaska';
				// var cities = container.children();

				// for(var i = 0; i < cities.length; i++) {
				// 	console.log('city');
				// }
			});

			// var title, release, rating;
			// var json = { title: "", release: "", rating: ""};

			// $('h1').filter(function() {
			// 	var data = $(this);

			// 	title = data.text();
			// 	release = data.children().first().children().first().text();

			// 	json.title = title;
			// 	console.log('json.title: ' + json.title);
			// 	json.release = release;
			// });

			// $('span[itemprop=ratingValue]').filter(function() {
			// 	var data = $(this);

			// 	rating = data.text();

			// 	json.rating = rating;
			// });

			// fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err) {
			// 	console.log('File successfully written! - Check your project directory for the output.json file');
			// });

			// res.send('Check your console!');
		}
		else {
			console.log('error');
		}
	});
});

app.listen('8081');
console.log('port 8081');
exports = module.exports = app;