//get array of city links within search states
//get listings for each city
//filter listings
//write to json file

//For development, get cl pages and host them locally
//var url = 'http://localhost/cl/sites';

var express = require("express");
var fs = require("fs");
var request = require("request");
var cheerio = require("cheerio");
var app = express();
var cs = require("./_cl");

//app.get("/syncrorojo", function(req, res) {
	var url = "http://localhost/cl/sites.html";

	request(url, function(error, response, html) {
		if(!error) {
			var $ = cheerio.load(html);
			//var locationUrls = [];
			var json = [];

			$("h4").filter(function() {
				var stateName = $(this).text();
				var searchStr = "Washington|Oregon|California|Arizona|Utah|Idaho|Nevada";
				/*<<<DEV>>>*/ searchStr = "Arizona";
				var searchStates = new RegExp(searchStr);

				if (searchStates.exec(stateName)) {
					//console.log('stateName:', stateName);
					json.push({"State": { "Name": stateName, "Cities": []}});
					
					var cities = $(this).next('ul').children();
					/*<<<DEV>>>*/ cities = '<li><a href="//flagstaff.craigslist.org/">flagstaff / sedona</a></li>';

					$(cities).each(function() {
						var cityName = $(this).text();
						var cityUrl = $(this).find("a").attr("href");

						json[0].State.Cities.push({ "Name": cityName, "Url": cityUrl, "Listings": []});

						var citySearchUrl = cs.BuildClSearchUrl(cityUrl);

						request(citySearchUrl, function(error, response, html) {
							if(!error) {
								var $ = cheerio.load(html);

								$("h4").prevAll().filter(function() {
									var id = $(this).attr("data-pid");
									var title = $(this).find(".hdrlnk").text();
									var price = $(this).find(".price").first().text().replace("$", "");
									var location = $(this).find("small").text().replace("(", "").replace(")", "");
									var datetime = $(this).find("time").attr("datetime");

									json[0].State.Cities[0].Listings.push({ "Id": id, "Title": title, "Price": price, "Location": location, "DateTime": datetime, "Status": ""});
									
									//console.log("id:", id);
									//console.log("title:", title);
									//console.log("price:", price);
									//console.log("datetime:", datetime);
									//console.log("location:", location);
								});
							}
							else {
								console.log("Failed to request city search URL");
							}
						});

						//locationUrls.push(cityUrl);
					});
				}
			});
			console.log("json", json);
			return;

			//console.log("locationUrls", locationUrls);

			/*<<<DEV>>>*/ locationUrls = ["http://localhost/cl/results.html"];

			$(locationUrls).each(function(index, value) {
				var url = cs.BuildClSearchUrl(value);
				//console.log(url);
				request(url, function(error, response, html) {
					if(!error) {
						var $ = cheerio.load(html);

						//before storing as json
						//cross-match against ignore.json

						$("h4").prevAll().filter(function() {
							var id = $(this).attr("data-pid");
							var title = $(this).find(".hdrlnk").text();
							var price = $(this).find(".price").first().text().replace("$", "");
							var location = $(this).find("small").text().replace("(", "").replace(")", "");
							var datetime = $(this).find("time").attr("datetime");
							
							//console.log("id:", id);
							//console.log("title:", title);
							//console.log("price:", price);
							//console.log("datetime:", datetime);
							//console.log("location:", location);
						});
					}
					else {
						console.log("Failed to request city search URL");
					}
				});
			});

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