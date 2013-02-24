//
// server.js - a light weight web server to support developing
// my rclock YUI web app.
//
// @author R. S. Doiel, <rsdoiel@gmail.com>
// copyright (c) 2013, R. S. Doiel
// all rights reserved
// Released under the BSD 2 Clause License
// See: http://opensource.org/licenses/BSD-2-Clause
//
/*jslint node: true */
"use strict";
var express = require("express"),
	fs = require("fs"),
	path = require("path"),
	YUI = require("yui").YUI,
	port = process.env.PORT || 3000,
    	host = process.env.HOPSTNAME || process.env.IP || "localhost",
	template = fs.readFileSync(path.join("htdocs", "index.html")).toString();



YUI({useSync: true, debug: true}).use("io-base", "datatype-date", "yql", function (Y) {
	var server = express();

	// Watch the template file for changes
	fs.watchFile(path.join("htdocs", "index.template"), function (curr, prev) {
		if (curr.mtime !== prev.mtime) {
			fs.readFile(path.join("htdocs", "index.html"), function (err, buf) {
				if  (err) {
					Y.log(err, "error");
					return;
				}
				Y.log("reloading template " + curr.mtime, "info");
				template = buf.toString();
			});
		}
	});

	Y.log("Loading", "info");
	/*
	 * Server Side Processing: (e.g. template rendering for non-JS requests)
	 */
	var render_page = function (request, response) {
		Y.YQL('select woeid, city from geo.placefinder where name = "91350"', function (geo_r) {
			var location_info = geo_r.query.results.Result || {},
				location_text = location_info.neighborhood ||
						location_info.city ||
						location_info.county ||
						"91350",
				forecastLI = "<li>{day} {high}/{low} {text}</li>",
				qry = [
					'select * from weather.forecast where woeid=',
					geo_r.query.results.Result.woeid
				].join("");

			Y.YQL(qry, function (weather_r) {
				var forecasts = weather_r.query.results.channel.item.forecast || {},
					forecasts_text = [];	

				forecasts_text.push(Y.Lang.sub(forecastLI, {
					day: "<b>Day</b>",
					high: "<b>Hi</b>",
					low: "<b>Lo</b>",
					text: "<b>Forecast</b>"
				}));	
				Y.Array.each(forecasts, function (forecast) {
					forecasts_text.push(Y.Lang.sub(forecastLI, forecast));
				});
				Y.log("Combine and send template", "info");
				var page = Y.Lang.sub(template, {
					location: location_text,
					forecasts: forecasts_text.join("\n"),
					time: Y.Date.format(new Date(), {format: "%l:%M %P"})
				});
				response.status(200).send(page);
			});
		});
	};

	/*
	 * Main: Setup and run  the web server
	 */
	server.use(express.logger());
	server.get("/", render_page);
	server.use(express.static(path.join(__dirname, "htdocs")));
	server.listen(port, host);
	Y.log("Starting up web server on port " + host + ":" + port, "info");
});


