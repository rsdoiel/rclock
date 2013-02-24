//
// rclock.js
//
/*jslint browser: true */
/*global YUI */
YUI().use("node", "io", "datatype-date",  "yql", function (Y) {
	var clock = Y.one("#clock"),
		pre = Y.one("pre"),
		clock_rate = 1000,
		weather = Y.one("#weather"),
		alarms = Y.one("#alarms");

	//Y.YQL('select latitude, longitude, uzip, woeid, city, county, state from geo.placefinder where name = "91350"', function (geo_r) {
	Y.YQL('select woeid from geo.placefinder where name = "91350"', function (geo_r) {
		var qry = [
			'select * from weather.forecast where woeid=',
			geo_r.query.results.Result.woeid
		].join("");
		Y.YQL(qry, function (weather_r) {
			pre.set('text', JSON.stringify(weather_r.query.results.channel.item.forecast).replace(/},{/g, "},\n{"));
		});
	});
	// FIXME: Need to only run the setInterval if the page
	// is visible. Check the Moz APIs for their Firefox OS
	// platform to see how to keep from burning battery
	// unnecessarily
	setInterval(function () {
		clock.setHTML(Y.Date.format(new Date(), {format: "%l:%I:%S %P"}));
	}, clock_rate);
});
