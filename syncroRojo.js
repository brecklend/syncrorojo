var fs = require("fs");
var request = require("request");
var cheerio = require("cheerio");
var cs = require("./_cl");

var json = [];

function GetStatesAndCitiesFor(query) {
	var sitesUrl = "http://localhost/cl/sites.html";

	request(sitesUrl, function(error, response, html) {
		if(!error) {
			var $ = cheerio.load(html);
			var jsonCnt = 0;

			$("h4").filter(function() {
				var stateName = $(this).text();
				var searchStates = new RegExp(query);

				if(searchStates.exec(stateName)) {
					json.push({"State": {"Name": stateName, "Cities": []}});

					var cities = $(this).next("ul").children();
					var cityCnt = 0;

					$(cities).each(function() {
						var cityName = $(this).text();
						var cityUrl = $(this).find("a").attr("href");
						var citySearchUrl = cs.BuildClSearchUrl(cityUrl);

						json[jsonCnt].State.Cities.push({"Name": cityName, "Url": cityUrl});

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

function GetListingsFor(city, url, callback) {
	var listings = [];

	request(url, function(error, response, html) {
		if(!error) {
			var $ = cheerio.load(html);

			$("h4").prevAll().filter(function() {
				var id = $(this).attr("data-pid");
				var title = $(this).find(".hdrlnk").text();
				var price = $(this).find(".price").first().text().replace("$", "");
				var location = $(this).find("small").text().replace("(", "").replace(")", "");
				var datetime = $(this).find("time").attr("datetime");

				listings.push({"Id": id, "Title": title, "Price": price, "Location": location, "DateTime": datetime});
			});

			callback(city, listings);
		}
		else {
			console.log("request listings fail");
		}
	});
}

function AddListingsToCity(city, listings) {
	for(var i = 0; i < json.length; i++) {
		for(var j = 0; j < json[i].State.Cities.length; j++) {
			if(json[i].State.Cities[j].Name == city) {
				json[i].State.Cities[j]["Listings"] = listings;
			}
		}
	}

	fs.writeFile("syncroRojo.json", JSON.stringify(json, null, 4), function(err) {
		
	});
	//console.log("******************************", JSON.stringify(json));
}

GetStatesAndCitiesFor("Arizona|California");