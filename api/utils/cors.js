module.exports = function() {
	return function(req, res, next) {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
		res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Accept, Authorization, Access-Controll-Allow-Credentials");
		res.header("Access-Control-Allow-Credentials", "true");
		next();
	};
}