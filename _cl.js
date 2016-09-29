
exports.BuildClSearchUrl = function(cityUrl) {
	return cityUrl;
	return replaceProtocalPrefix(cityUrl) + getUrlSearchString() + getKeywords();
}

function replaceProtocalPrefix(url) {
	return url.replace("//", "http://");
}

function getUrlSearchString() {
	return "search/sss?sort=rel&query=";
}

function getKeywords() {
	return "4wd+van";
}