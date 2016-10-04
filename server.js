var express = require("express");
var fs = require("fs");
var request = require("request");
var cheerio = require("cheerio");
var app = express();
var cs = require("./_cl");

var cityUrl = "http://localhost/cl/results.html";

var listings = [];

for(var i = 0; i < 2; i++) {
	//go through json and get each State.Cities[].Url
	//call GetListingsFor(State.Cities[n].Url)
	listings.push(GetListingsFor(cityUrl));
}

console.log("listings.length:", listings.length);

//takes city URL string
//returns json of listing(s)
function GetListingsFor(cityUrl) {
	console.log("GetListingsFor.city:", cityUrl);

	var p1 = new Promise(function(resolve, reject) {
		console.log("p1");
		request(cityUrl, function(error, response, html) {
			if(!error) {
				console.log("success");
				resolve({"Id":"5780376329","Title":"94 gmc safari awd"});
			}
			else {
				throw "fail";
			}
		});
	});

	p1.then(function(val) {
		console.log("then.val:", val);
		return val;
	}).catch(function(reason) {
		console.log("reason:", reason);
	});
}

function GetListingsForCitiesBasedOnStates() {
	console.log("start");

	var p1 = new Promise(function(resolve, reject) {
		console.log("p1");
		request("http://localhost/cl/sites.html", function(error, response, html) {
			if(!error) {
				console.log("success");
				resolve("success");
			}
			else {
				console.log("fail");
				throw "fail";
			}
		});
	});

	p1.then(function(val) {
		console.log("then.val:", val);
	}).catch(function(reason) {
		console.log("reason:", reason);
	});
}

//GetListingsForCitiesBasedOnStates();

/////////////////////////////////////////////////////////////////////////////////////////////////////

var getCitiesFor = function(states, callback) {
	console.log("getCitiesFor");
	var sitesUrl = "http://localhost/cl/sites.html";

	request(sitesUrl, function(error, response, html) {
		if(!error) {
			return getListingsFor(["http://localhost/cl/results.html", "http://localhost/cl/results.html"], function(err, result) {
				if(!err) {
					return callback(null, result);
				}
				else {
					return callback("one and two failed");
				}
			});
		}
		else {
			return callback("getCitiesFor fail");
		}
	});
};

var getListingsFor = function(cities, callback) {
	console.log("getListingsFor");
	var listings = [];

	//var url = "http://localhost/cl/results.html";
	//console.log("cities.length", cities.length);
	for(var i = 0; i < cities.length; i++) {
		console.log("i", i);
		//console.log("cities[i]:", cities[i]);
		request(cities[i], function(error, response, html) {
			if(!error) {
				//console.log("getListingsFor request success");
				listings.push({"Status": "Success"});

				//console.log("i", i, "len", cities.length);
				if (i == cities.length) {
					return callback(null, listings);
				}
			}
			else {
				return callback("getListingsFor request failed");
			}
		});
	}
};

// getCitiesFor("Arizona|California", function(err, result) {
// 	console.log("finished");
// 	if(!err) {
// 		//result = complete json
// 		//console.log("result:", result);
// 	}
// 	else {
// 		console.log("err:", err);
// 	}
// });

////////////////////////////////////////////////////////////////////////////////////////////////

// var getCitiesFor = function(states, callback) {
// 	var sitesUrl = "http://localhost/cl/sites.html";

// 	request(sitesUrl, function(error, response, html) {
// 		if(!error) {
// 			var $ = cheerio.load(html);
// 			var json = [];
// 			var jsonCnt = 0;

// 			$("h4").filter(function() {
// 				var stateName = $(this).text();
// 				var searchStates = new RegExp(states);

// 				if (searchStates.exec(stateName)) {
// 					json.push({"State": {"Name": stateName, "Cities": []}});

// 					var cities = $(this).next('ul').children();
// 					var cityCnt = 0;

// 					$(cities).each(function() {
// 						var cityName = $(this).text();
// 						var cityUrl = $(this).find("a").attr("href");
// 						var citySearchUrl = cs.BuildClSearchUrl(cityUrl);
						
// 						json[jsonCnt].State.Cities.push({"Name": cityName, "Url": cityUrl, "Listings": []});

// 						getListings(citySearchUrl, function(err, data) {
// 							json[jsonCnt].State.Cities[cityCnt].Listings.push(data);
// 							cityCnt += 1;
// 						});
// 					});

// 					jsonCnt += 1;
// 				}
// 			});

// 			return callback(null, json);
// 		}
// 		else {
// 			console.log("request error");
// 			return callback(true, "Failed sites request");
// 		}
// 	});
// };

// var getListings = function(url, callback) {
// 	var listings = [];

// 	request(url, function(error, response, html) {
// 		if(!error) {
// 			var $ = cheerio.load(html);

// 			$("h4").prevAll().filter(function() {
// 				var id = $(this).attr("data-pid");
// 				var title = $(this).find(".hdrlnk").text();
// 				var price = $(this).find(".price").first().text().replace("$", "");
// 				var location = $(this).find("small").text().replace("(", "").replace(")", "");
// 				var datetime = $(this).find("time").attr("datetime");

// 				listings.push({"Id": id, "Title": title});
// 			});
// 		}
// 		else {
// 			console.log("Failed city search request");
// 			return callback(true, "Failed city search request");
// 		}

// 		console.log("listings.length:", listings.length);
// 		return callback(null, listings);
// 	});
// };

// var getListingsRename = function(err, json) {
// 	console.log("getListingsRename");
// 	return;
	
// 	for(var i = 0; i < json.length; i++) {
// 		for(var j = 0; j < json[i].State.Cities.length; j++) {
// 			var citySearchUrl = cs.BuildClSearchUrl(json[i].State.Cities[j].Url);
// 		}
// 	}
// };

//getCitiesFor("Arizona|California", getListingsRename);




// var sitesUrl = "http://localhost/cl/sites.html";

// request(sitesUrl, function(error, response, html) {
// 	if(!error) {
// 		var $ = cheerio.load(html);
// 		var json = [];
// 		var jcnt = 0;

// 		$("h4").filter(function() {
// 			var stateName = $(this).text();
// 			var searchStr = "Washington|Oregon|California|Arizona|Utah|Idaho|Nevada";
// 			/*<<<DEV>>>*/ searchStr = "Arizona|California";
// 			var searchStates = new RegExp(searchStr);

// 			if (searchStates.exec(stateName)) {
// 				json.push({"State": { "Name": stateName, "Cities": []}});
				
// 				var cities = $(this).next('ul').children();
// 				var cityCnt = 0;

// 				$(cities).each(function() {
// 					var cityName = $(this).text();
// 					var cityUrl = $(this).find("a").attr("href");

// 					json[jcnt].State.Cities.push({ "Name": cityName, "Url": cityUrl, "Listings": [] });

// 					var citySearchUrl = cs.BuildClSearchUrl(cityUrl);

// 					var cityListings = [];
// 					//wait for city search to return before incrementing counter and continuing loop
// 					request(citySearchUrl, function(error, response, html) {
// 						if(!error) {
// 							var $ = cheerio.load(html);

// 							$("h4").prevAll().filter(function() {
// 								var id = $(this).attr("data-pid");
// 								var title = $(this).find(".hdrlnk").text();
// 								var price = $(this).find(".price").first().text().replace("$", "");
// 								var location = $(this).find("small").text().replace("(", "").replace(")", "");
// 								var datetime = $(this).find("time").attr("datetime");

// 								//cityListings.push({ "Id": id, "Title": title});
								
// 								//json[jcnt].State.Cities[cityCnt].Listings.push({ "Id": id, "Title": title, "Price": price, "Location": location, "DateTime": datetime, "Status": ""});
// 							});
// 						}
// 						else {
// 							console.log("Failed to request city search URL");
// 						}
// 					});

// 					cityCnt += 1;
// 				});

// 				jcnt += 1;
// 			}
// 		});

// 		// console.log(json);
// 		// fs.writeFile("output.json", JSON.stringify(json, null, 4), function(err) {
// 		// 	console.log("json file written");
// 		// });

// 		//res.send('Check your console!');
// 	}
// 	else {
// 		console.log('error');
// 	}
// });