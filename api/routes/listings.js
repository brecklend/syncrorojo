var jsonIo = require("../utils/jsonIo");

var listings;

jsonIo.getListings(function(data) {
	listings = data;
});

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
	updateListingStatusFor(req.params.id, "tracked");
	jsonIo.saveListings(listings, function(rsp) {
		res.send(rsp);
	});
};

exports.ignore = function(req, res) {
	updateListingStatusFor(req.params.id, "ignore");
	jsonIo.saveListings(listings, function(rsp) {
		res.send(rsp);
	});
};

function getListingsFor(statusType) {
	var list = [];

	for (var i = 0; i < listings.length; i++) {
		if (listings[i].status == statusType) {
			list.push(listings[i]);
		}
	}

	return list;
}

function updateListingStatusFor(id, status) {
	for (var i = 0; i < listings.length; i++) {
		if (listings[i].id == id) {
			listings[i].status = status;
			return;
		}
	}
}