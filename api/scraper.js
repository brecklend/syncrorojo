// Notes //////////////////////////////////////////////////////////////////////
// Every time this runs, api needs to be restarted
///////////////////////////////////////////////////////////////////////////////

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
						console.log("  ", citySearchUrl);

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
				var id = parseInt($(this).attr("data-pid"));
				var url = "http://craigslist.com/needToBuildThis";
				var title = $(this).find(".hdrlnk").text();
				var price = parseInt($(this).find(".price").first().text().replace("$", ""));
				var location = $(this).find("small").text().replace("(", "").replace(")", "");
				var datetime = $(this).find("time").attr("datetime");

				var listing = getListingFor(id);

				if (listing === undefined) {
					listings.push(buildNewListingObjectFor(id, url, title, price, location, cityName, stateName, datetime));
				}
				else {
					if (listing.statue != "ignore") {
						if (listing.price[listing.price.length - 1] != price) {
							listing.price.push(price);
							listing.datetime.push(datetime);
						}
					}
				}
			});

			callback();
		}
		else {
			console.log("failed request for city");
		}
	});
}

function GetListingsCallback() {
	console.log("GetListingsCallback");
	jsonIo.saveListings(listings, function(rsp) {
		if (rsp.Success) {
			console.log("Successfully saved listings");
		}
		else {
			console.log("Failed to save listings:", rsp.Message);
		}
	});
}



// Helpers ////////////////////////////////////////////////////////////////////
function getListingFor(listingId) {
	var listing;

	for (var i = 0; i < listings.length; i++) {
		if (listings[i].id == listingId) {
			listing = listings[i];
		}
	}

	return listing;
}

function buildNewListingObjectFor(id, url, title, price, location, city, state, datetime) {
	return ({
		"id": id,
		"url": url,
		"title": title,
		"price": [price],
		"location": location,
		"city": city,
		"state": state,
		"datetime": [datetime],
		"status": "new"
	});
}
///////////////////////////////////////////////////////////////////////////////