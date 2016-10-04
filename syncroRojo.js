var fs = require("fs");
var request = require("request");
var cheerio = require("cheerio");
var cs = require("./_cl");

// var json = [];
// GetStatesAndCitiesFor("Arizona|California");

var json;

function Init() {
	fs.readFile("syncroRojo.json", "utf8", (err, data) => {
		if(!err) {
			console.log("successfully read file");
			json = JSON.parse(data);
			//GetStatesAndCitiesFor("Arizona|California");
		}
		else {
			console.log("failed read file");
		}
	});
}

Init();

function GetStatesAndCitiesFor(query) {
	var sitesUrl = "http://localhost/cl/sites.html";

	request(sitesUrl, function(error, response, html) {
		if (!error) {
			var $ = cheerio.load(html);
			var jsonCnt = 0;

			$("h4").filter(function() {
				var stateName = $(this).text();
				var searchStates = new RegExp(query);

				if (searchStates.exec(stateName)) {

					//check if State already exists
					// var t = JSON.parse(JSON.stringify(json));
					// console.log("t", t.State.Name);

					//check if city already exists

					if (!StateExists(stateName)) {
						json.push({"State": {}});
						json[jsonCnt].State["Name"] = stateName;
						json[jsonCnt].State["Cities"] = [];
					}

					var cities = $(this).next("ul").children();
					var cityCnt = 0;

					$(cities).each(function() {
						var cityName = $(this).text();
						var cityUrl = $(this).find("a").attr("href");
						var citySearchUrl = cs.BuildClSearchUrl(cityUrl);

						if (!CityExists(stateName, cityName)) {
							json[jsonCnt].State.Cities.push({"Name": cityName, "Url": cityUrl});
						}

						GetListingsFor(cityName, citySearchUrl, AddListingsToCity);
					});

					jsonCnt += 1;
				}
			});
		}
		else {
			console.log("request sites failed");
		}
	});
}

function StateExists(stateName) {
	for (var i = 0; i < json.length; i++) {
		if (json[i].State.Name == stateName) {
			return true;
		}
	}

	return false;
}

function CityExists(stateName, cityName) {
	for (var i = 0; i < json.length; i++) {
		if (json[i].State.Name == stateName) {
			for (var j = 0; j < json[i].State.Cities.length; j++) {
				if (json[i].State.Cities[j].Name == cityName) {
					return true;
				}
			}
		}
	}

	return false;
}

function ListingExists(cityName, listingId) {
	for (var i = 0; i < json.length; i++) {
		for (var j = 0; j < json[i].State.Cities.length; j++) {
			if (json[i].State.Cities[j].Name == cityName) {
				for (var k = 0; k < json[i].State.Cities[j].Listings.length; k++) {
					if (json[i].State.Cities[j].Listings[k].Id == listingId) {
						return true;
					}
				}
			}
		}
	}

	return false;
}

function ListingPriceHasChanged(cityName, listingId, price) {
	for (var i = 0; i < json.length; i++) {
		for (var j = 0; j < json[i].State.Cities.length; j++) {
			if (json[i].State.Cities[j].Name == cityName) {
				for (var k = 0; k < json[i].State.Cities[i].Listings.length; k++) {
					if (json[i].State.Cities[j].Listings[k].Id == listingId) {
						if (json[i].State.Cities[j].Listings[k].Price != price) {
							return true;
						}
					}
				}
			}
		}
	}

	return false;
}

function GetListingsFor(cityName, url, callback) {
	var listings = [];

	request(url, function(error, response, html) {
		if (!error) {
			var $ = cheerio.load(html);

			$("h4").prevAll().filter(function() {
				var id = $(this).attr("data-pid");
				var title = $(this).find(".hdrlnk").text();
				var price = $(this).find(".price").first().text().replace("$", "");
				var location = $(this).find("small").text().replace("(", "").replace(")", "");
				var datetime = $(this).find("time").attr("datetime");

				if (!ListingExists(cityName, id)) {
					var listing = {
						"Id": id,
						"Title": title,
						"Price": [parseInt(price)],
						"Location": location,
						"DateTime": [datetime]
					};

					listings.push(listing);
				}
				else {
					//if change in price push price & datetime
				}
			});

			callback(cityName, listings);
		}
		else {
			console.log("request listings fail");
		}
	});
}

function AddListingsToCity(cityName, listings) {
	for (var i = 0; i < json.length; i++) {
		for (var j = 0; j < json[i].State.Cities.length; j++) {
			if (json[i].State.Cities[j].Name == cityName) {
				json[i].State.Cities[j]["Listings"] = listings;
			}
		}
	}

	fs.writeFile("syncroRojo.json", JSON.stringify(json, null, 4), function(err) {
		
	});
	//console.log("******************************", JSON.stringify(json));
}