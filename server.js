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
			var json = [];
			var jcnt = 0;

			$("h4").filter(function() {
				var stateName = $(this).text();
				var searchStr = "Washington|Oregon|California|Arizona|Utah|Idaho|Nevada";
				/*<<<DEV>>>*/ searchStr = "Arizona|California";
				var searchStates = new RegExp(searchStr);

				if (searchStates.exec(stateName)) {
					json.push({"State": { "Name": stateName, "Cities": []}});
					
					var cities = $(this).next('ul').children();
					/*<<<DEV>>>*/ //cities = '<li><a href="//flagstaff.craigslist.org/">flagstaff / sedona</a></li>';

					var cityCnt = 0;

					$(cities).each(function() {
						var cityName = $(this).text();
						var cityUrl = $(this).find("a").attr("href");

						json[jcnt].State.Cities.push({ "Name": cityName, "Url": cityUrl, "Listings": [] });

						var citySearchUrl = cs.BuildClSearchUrl(cityUrl);
						//console.log("Listings", json[jcnt].State.Name + " - " + json[jcnt].State.Cities[cityCnt].Name);
						//console.log(json[jcnt].State.Name);
						
						var cityListings = [];
						console.log("before citySearchUrl");
						request(citySearchUrl, function(error, response, html) {
							//console.log("jcnt:", jcnt, " cityCnt:", cityCnt);
							//console.log(json[jcnt].State.Name);
							if(!error) {
								var $ = cheerio.load(html);

								$("h4").prevAll().filter(function() {
									var id = $(this).attr("data-pid");
									var title = $(this).find(".hdrlnk").text();
									var price = $(this).find(".price").first().text().replace("$", "");
									var location = $(this).find("small").text().replace("(", "").replace(")", "");
									var datetime = $(this).find("time").attr("datetime");

									cityListings.push({ "Id": id, "Title": title});
									
									//json[jcnt].State.Cities[cityCnt].Listings.push({ "Id": id, "Title": title, "Price": price, "Location": location, "DateTime": datetime, "Status": ""});
								});
							}
							else {
								console.log("Failed to request city search URL");
							}
							console.log("inside length", cityListings.length);
						});

						console.log("outside length", cityListings.length);
						cityCnt += 1;
					});

					jcnt += 1;
				}
			});

			// console.log(json);
			// fs.writeFile("output.json", JSON.stringify(json, null, 4), function(err) {
			// 	console.log("json file written");
			// });

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