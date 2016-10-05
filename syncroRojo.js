var $ = require("jquery");
var fs = require("fs");
var request = require("request");
var cheerio = require("cheerio");
var cs = require("./_cl");
///////////////////////////////////////////////////////////////////////////////


var json;

function Init() {
	fs.readFile("syncroRojo.json", "utf8", (err, data) => {
		if(!err) {
			console.log("successfully read file");
			json = JSON.parse(data);
			GetStatesAndCitiesFor("Arizona|California");
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
			var $c = cheerio.load(html);
			var jsonCnt = 0;

			$c("h4").filter(function() {
				var stateName = $c(this).text();
				var searchStates = new RegExp(query);

				if (searchStates.exec(stateName)) {
					if (!stateExists(stateName)) {
						json.push({"State": {}});
						json[jsonCnt].State["Name"] = stateName;
						json[jsonCnt].State["Cities"] = [];
					}

					var cities = $c(this).next("ul").children();
					var cityCnt = 0;

					$c(cities).each(function() {
						var cityName = $c(this).text();
						var cityUrl = $c(this).find("a").attr("href");
						var citySearchUrl = cs.BuildClSearchUrl(cityUrl);

						if (!cityExists(stateName, cityName)) {
							json[jsonCnt].State.Cities.push({"Name": cityName, "Url": cityUrl, "Listings": []});
						}

						GetListingsFor(cityName, citySearchUrl, AddListingsToCity);
					});

					jsonCnt += 1;
				}
			});

			//writeFile();
		}
		else {
			console.log("request sites failed");
		}
	});
}

function stateExists(stateName) {
	for (var i = 0; i < json.length; i++) {
		if (json[i].State.Name == stateName) {
			return true;
		}
	}

	return false;
}

function cityExists(stateName, cityName) {
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

function getPriceArrayFor(cityName, listingId) {
	for (var i = 0; i < json.length; i++) {
		for (var j = 0; j < json[i].State.Cities.length; j++) {
			if (json[i].State.Cities[j].Name == cityName) {
				for (var k = 0; k < json[i].State.Cities[j].Listings.length; k++) {
					if (json[i].State.Cities[j].Listings[k].Id == listingId) {
						return json[i].State.Cities[j].Listings[k].Price;
					}
				}
			}
		}
	}
	
	return [];
}

function getDateTimeArrayFor(cityName, listingId) {
	for (var i = 0; i < json.length; i++) {
		for (var j = 0; j < json[i].State.Cities.length; j++) {
			if (json[i].State.Cities[j].Name == cityName) {
				for (var k = 0; k < json[i].State.Cities[j].Listings.length; k++) {
					if (json[i].State.Cities[j].Listings[k].Id == listingId) {
						return json[i].State.Cities[j].Listings[k].DateTime;
					}
				}
			}
		}
	}

	return [];
}

function getStatusFor(cityName, listingId) {
	for (var i = 0; i < json.length; i++) {
		for (var j = 0; j < json[i].State.Cities.length; j++) {
			if (json[i].State.Cities[j].Name == cityName) {
				for (var k = 0; k < json[i].State.Cities[j].Listings.length; k++) {
					if (json[i].State.Cities[j].Listings[k].Id == listingId) {
						return json[i].State.Cities[j].Listings[k].Status;
					}
				}
			}
		}
	}

	return "";
}

function GetListingsFor(cityName, url, callback) {
	var listings = [];

	request(url, function(error, response, html) {
		if (!error) {
			var $c = cheerio.load(html);

			$c("h4").prevAll().filter(function() {
				var id = $c(this).attr("data-pid");
				var title = $c(this).find(".hdrlnk").text();
				var price = $c(this).find(".price").first().text().replace("$", "");
				var location = $c(this).find("small").text().replace("(", "").replace(")", "");
				var datetime = $c(this).find("time").attr("datetime");

				var priceAry = getPriceArrayFor(cityName, id);
				var dateTimeAry = getDateTimeArrayFor(cityName, id);
				var status = getStatusFor(cityName, id);
				
				if (priceAry[priceAry.length - 1] != price) {
					priceAry.push(parseInt(price));
					dateTimeAry.push(datetime);
				}

				var listing = {
					"Id": id,
					"Title": title,
					"Price": priceAry,
					"Location": location,
					"DateTime": dateTimeAry,
					"Status": status
				};

				listings.push(listing);
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

	writeFile();
	//console.log("******************************", JSON.stringify(json));
}

function writeFile() {
	fs.writeFile("syncroRojo.json", JSON.stringify(json, null, 4), function(err) {
		//
	});
}