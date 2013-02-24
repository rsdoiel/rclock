//
// rclock.js
//
/*jslint browser: true */
/*global YUI */
YUI({debug: true}).use("node", "io", "datatype-date", "yql", "template", function (Y) {
	var micro = new Y.Template(),
		clock = Y.one("#clock"),
		pre = Y.one("pre"),
		clock_rate = 60000,
		weather = Y.one("#weather"),
		location = Y.one("#location"),
		forecasts = Y.one("#forecasts"),
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
			var forecasts_data = weather_r.query.results.channel.item.forecast || {},
				forecast_text = [];

			forecast_text.push(Y.Lang.sub(forecastLI, {
				day: "<b>Day</b>",
				high: "<b>Hi</b>",
				low: "<b>Lo</b>",
				text: "<b>Forecast</b>"
			}));	
			Y.Array.each(forecasts_data, function (forecast) {
				forecast_text.push(Y.Lang.sub(forecastLI, forecast));
			});
			forecasts.setHTML(forecast_text.join("\n"));
		});
	});
	// FIXME: Need to only run the setInterval if the page
	// is visible. Check the Moz/Chrome APIs for their Firefox OS/Chrome OS
	// platforms to see how to keep from burning battery
	// unnecessarily
	setInterval(function () {
		var t = new Date();
		Y.log(t, "debug");
		clock.setHTML(Y.Date.format(t, {format: "%l:%M %P"}));
	}, clock_rate);
});
