var fs = require("fs");

var listingsPath = "./data/listings.json";
var listings;

readJson();

exports.getAllListings = function(req, res) {
	res.send(listings);
};

exports.getNewListings = function(req, res) {
	res.send(getListingsFor("new"));
};

exports.getTrackedListings = function(req, res) {
	res.send(getListingsFor("tracked"));
};

exports.track = function(req, res) {
	var id = req.params.id;

	for (var i = 0; i < listings.length; i++) {
		if (listings[i].id == id) {
			listings[i].status = "tracked";
			break;
		}
	}

	writeJson();
	res.send({ "Success": true, "Message": "" });
};

exports.ignore = function(req, res) {
	res.send({ "Success": true, "Message": "" });
};



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





function getListingsFor(statusType) {
	var list = [];

	for (var i = 0; i < listings.length; i++) {
		if (listings[i].status == statusType) {
			list.push(listings[i]);
		}
	}

	return list;
}

function getListingFor(listingId) {
	for (var i = 0; i < listings.length; i++) {
		if (listings[i].id == listingId) {
			return listings[i];
		}
	}
}