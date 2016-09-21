var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app = express();

//check if /scrape needs to be the name of the directory: /scotch
app.get('/scrape', function(req, res) {
	var url = 'http://www.imdb.com/title/tt1229340/';

	request(url, function(error, response, html) {
		if(!error) {
			var $ = cheerio.load(html);
			var title, release, rating;
			var json = { title: "", release: "", rating: ""};

			$('h1').filter(function() {
				var data = $(this);

				title = data.text();
				release = data.children().first().children().first().text();

				json.title = title;
				console.log('json.title: ' + json.title);
				json.release = release;
			});

			$('span[itemprop=ratingValue]').filter(function() {
				var data = $(this);

				rating = data.text();

				json.rating = rating;
			});

			fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err) {
				console.log('File successfully written! - Check your project directory for the output.json file');
			});

			res.send('Check your console!');
		}
	});
});

app.listen('8081');
console.log('port 8081');
exports = module.exports = app;