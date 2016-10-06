var fs = require("fs");

var listingsPath = "./data/listings.json";

exports.getListings = function(callback) {
	fs.readFile(listingsPath, "utf8", (err, data) => {
		if (!err) {
			console.log("read file");
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
			console.log("error writing file");
			return callback({ Success: false, "Message": "Failed to write file" });
		}
		else {
			console.log("success writing file");
			return callback({ Success: true, "Message": "Successfully wrote file" });
		}
	});
};