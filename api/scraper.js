var cl = require("./utils/_cl");
var jsonIo = require("./utils/jsonIo");
var request = require("request");
var cheerio = require("cheerio");
var fs = require("fs");



//*** Initialization **********************************************************
var listings;

jsonIo.getListings(function(data) {
	listings = data;
	GetStatesAndCitiesFor(states);
})
//*****************************************************************************



var states = "Arizona|California";
var sitesUrl = "http://localhost/cl/sites.html";



function GetStatesAndCitiesFor(query) {
	request(sitesUrl, function(err, res, html) {
		if (!err) {
			var $ = cheerio.load(html);
			var cityUrls = [];

			$("h4").filter(function() {
				var stateName = $(this).text();
				var searchStates = new RegExp(query);

				if (searchStates.exec(stateName)) {
					console.log("Searching " + stateName + " for cities");
					var cities = $(this).next("ul").children();

					$(cities).each(function() {
						var cityName = $(this).text();
						var cityUrl = $(this).find("a").attr("href");
						var citySearchUrl = cl.BuildClSearchUrl(cityUrl);

						console.log("  ", cityName);
						GetListingsFor(citySearchUrl, cityName, stateName, GetListingsCallback);
					});
				}
			});
		}
		else {
			console.log("failed request of states");
		}
	});
}

function GetListingsFor(cityUrl, cityName, stateName, callback) {
	request(cityUrl, function(err, res, html) {
		if (!err) {
			var $ = cheerio.load(html);

			$("h4").prevAll().filter(function() {
				var id = $(this).attr("data-pid");
				var title = $(this).find(".hdrlnk").text();
				var price = $(this).find(".price").first().text().replace("$", "");
				var priceAry = [];
				var location = $(this).find("small").text().replace("(", "").replace(")", "");
				var datetime = $(this).find("time").attr("datetime");
				var datetimeAry = [];

				// {
			 //        "id": 1010101010,
			 //        "url": "http://craigslist.org/",
			 //        "title": "Sample",
			 //        "price": [
			 //            1500,
			 //            1200
			 //        ],
			 //        "location": "w",
			 //        "city": "f",
			 //        "state": "CA",
			 //        "datetime": [
			 //            "2016-09-18 13:32",
			 //            "2016-10-06 11:15"
			 //        ],
			 //        "status": "new"
			 //    }
			});
		}
		else {
			console.log("failed request for city");
		}
	});
}

function GetListingsCallback() {
	console.log("GetListingsCallback");
}