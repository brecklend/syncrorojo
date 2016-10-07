var fs = require("fs");

var listingsPath = "./data/listings.json";

exports.getListings = function(callback) {
	fs.readFile(listingsPath, "utf8", (err, data) => {
		if (!err) {
			return callback(JSON.parse(data));
		}
		else {
			console.log("fail read");
		}
	});
};

exports.saveListings = function(listings, callback) {
	fs.writeFile(listingsPath, JSON.stringify(listings, null, 4), function(err) {
		if (err) {
			return callback({ Success: false, "Message": "Failed to write file" });
		}
		else {
			return callback({ Success: true, "Message": "Successfully wrote file" });
		}
	});
};