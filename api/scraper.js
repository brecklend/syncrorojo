var cl = require("./utils/_cl");
var request = require("request");
var cheerio = require("cheerio");
var fs = require("fs");



//*** Initialization **********************************************************
var listingsPath = "./data/listings.json";
var listings;

readJson();
//*****************************************************************************



//















//*** IO **********************************************************************
function readJson() {
	fs.readFile(listingsPath, "utf8", (err, data) => {
		if (!err) {
			listings = JSON.parse(data);
		}
		else {
			listings = [];
		}
	});
}

function writeJson() {
	fs.writeFile(listingsPath, JSON.stringify(listings, null, 4), function(err) {
		if (err) {
			console.log("error writing file");
		}
		else {
			console.log("success writing file");
		}
	});
}
//*****************************************************************************