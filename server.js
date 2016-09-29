//get array of city links within search states
//get listings for each city
//filter listings
//write to json file

//For development, get cl pages and host them locally
//var url = 'http://localhost/cl/sites';

var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app = express();

//app.get('/syncrorojo', function(req, res) {
	var url = 'http://localhost/cl/sites.html';

	request(url, function(error, response, html) {
		if(!error) {
			var $ = cheerio.load(html);

			var searchData = [];
			var locationUrls = [];

			$('h4').filter(function() {
				var stateName = $(this).text();
				var searchStr = "Washington|Oregon|California|Arizona|Utah|Idaho|Nevada";
				//<<<DEV>>>>>>>>>>>>>
				searchStr = "Alaska|Arizona";
				//<<<<<<<<<<<<<<<<<<<
				var searchStates = new RegExp(searchStr);

				if (searchStates.exec(stateName)) {
					//console.log('stateName:', stateName);
					var cities = $(this).next('ul').children();

					$(cities).each(function() {
						var cityName = $(this).text();
						var cityUrl = $(this).find("a").attr("href").replace("//", "http://");

						locationUrls.push(cityUrl);
						//console.log("cityName:", cityName, "- cityUrl:", cityUrl);
					});
				}
			});

			console.log("locationUrls", locationUrls);

			//res.send('Check your console!');
		}
		else {
			console.log('error');
		}
	});
//});

// app.listen('8081');
// console.log('port 8081');
// exports = module.exports = app;