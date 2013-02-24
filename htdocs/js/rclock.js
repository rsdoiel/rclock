//
// rclock.js - browser side process for running the clock and pulling the weather data.
//
// @author R. S. Doiel, <rsdoiel@gmail.com>
// copyright (c) 2013, R. S. Doiel
// all rights reserved
// Released under the BSD 2 Clause License
// See: http://opensource.org/licenses/BSD-2-Clause
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
		forecasts = Y.one("#forecasts"),
		alarms = Y.one("#alarms");

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
	clock.setHTML(Y.Date.format(new Date(), {format: "%l:%M %P"}));
	setInterval(function () {
		var t = new Date();
		clock.setHTML(Y.Date.format(t, {format: "%l:%M %P"}));
	}, clock_rate);
});
