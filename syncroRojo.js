var fs = require("fs");
var request = require("request");
var cheerio = require("cheerio");
var cs = require("./_cl");

var json = [];

function GetStatesAndCitiesFor(query) {
	//console.log("GetStatesAndCitiesFor.query", query);
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

			//console.log(JSON.stringify(json));
		}
		else {
			console.log("request sites failed");
		}
	});

	// json.push({"State": {"Name": "Arizona", "Cities": [{"Name": "flagstaff / sedona", "Url": "http://localhost/cl/results.html"},{"Name": "mohave county", "Url": "http://localhost/cl/results.html"}]}});
	// for(var i = 0; i < json.length; i++) {
	// 	for(var j = 0; j < json[i].State.Cities.length; j++) {
	// 		var cityName = json[i].State.Cities[j].Name;
	// 		var cityUrl = json[i].State.Cities[j].Url;

	// 		GetListingsFor(cityName, cityUrl, AddListingsToCity);
	// 	}
	// }
}

function GetListingsFor(city, url, callback) {
	//console.log("GetListingsFor.city", city, " url", url);
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

				//console.log("GetListingsFor", id, title);
				listings.push({"Id": id, "Title": title, "Price": price, "Location": location, "DateTime": datetime});
			});

			//console.log("end");
			callback(city, listings);
		}
		else {
			console.log("request listings fail");
		}
	});

	// if(city == "flagstaff / sedona") {
	// 	listings = [{"Id": "11111", "Title": "One"}, {"Id": "22222", "Title": "Two"}];
	// }
	// else {
	// 	listings = [{"Id": "33333", "Title": "Three"}, {"Id": "44444", "Title": "Four"}];
	// }
	
	// callback(city, listings);
}

function AddListingsToCity(city, listings) {
	//console.log("AddListingsToCity.city", city, " listings", listings);
	for(var i = 0; i < json.length; i++) {
		for(var j = 0; j < json[i].State.Cities.length; j++) {
			if(json[i].State.Cities[j].Name == city) {
				json[i].State.Cities[j]["Listings"] = listings;
			}
		}
	}

	fs.writeFile("syncroRojo.json", JSON.stringify(json, null, 4), function(err) {
		console.log("wrote file");
	});
	//console.log("******************************", JSON.stringify(json));
}

GetStatesAndCitiesFor("Arizona|California");