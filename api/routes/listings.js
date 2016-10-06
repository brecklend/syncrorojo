var fs = require("fs");

var listings;

getListings();

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
	res.send({ "Success": true, "Message": "" });
};

exports.ignore = function(req, res) {
	res.send({ "Success": true, "Message": "" });
};

function getListings() {
	fs.readFile("./data/listings.json", "utf8", (err, data) => {
		if (!err) {
			listings = JSON.parse(data);
		}
		else {
			console.log("read json file failure");
			listings = [];
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