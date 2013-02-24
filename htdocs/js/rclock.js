//
// rclock.js
//
/*jslint browser: true */
/*global YUI */
YUI().use("node", "io", "datatype-date", "yql", "template", function (Y) {
	var micro = new Y.Template(),
		clock = Y.one("#clock"),
		pre = Y.one("pre"),
		clock_rate = 60000,
		weather = Y.one("#weather"),
		location = Y.one("#location"),
		forecase = Y.one("#forecast"),
		alarms = Y.one("#alarms");

	//Y.YQL('select latitude, longitude, uzip, woeid, city, county, state from geo.placefinder where name = "91350"', function (geo_r) {
	Y.YQL('select woeid, city from geo.placefinder where name = "91350"', function (geo_r) {
		var location_info = geo_r.query.results.Result || {};
		var forecastLI = "<li>{day} {high}/{low} {text}</li>";
		var qry = [
			'select * from weather.forecast where woeid=',
			geo_r.query.results.Result.woeid
		].join("");
		location.set('text', location_info.neighborhood || location_info.city || location_info.county);
		Y.YQL(qry, function (weather_r) {
			var forecasts = weather_r.query.results.channel.item.forecast || {},
				output = [];	

			location.set("html", Y.Lang.sub(forecastLI, {
				day: "<b>Day</b>",
				high: "<b>Hi</b>",
				low: "<b>Lo</b>",
				text: "<b>forecase</b>"
			}));	
			Y.Array.each(forecasts, function (forecast) {
				location.append(Y.Lang.sub(forecastLI, forecast));
			});
		});
	});
	// FIXME: Need to only run the setInterval if the page
	// is visible. Check the Moz APIs for their Firefox OS
	// platform to see how to keep from burning battery
	// unnecessarily
	setInterval(function () {
		clock.setHTML(Y.Date.format(new Date(), {format: "%l:%I %P"}));
	}, clock_rate);
});
