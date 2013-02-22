
/*jslint browser: true */
/*global YUI */
YUI().use("node", "datetype-date", "io", function (Y) {
	"use strict";
	var weather = Y.one("#weather"),
		clock = Y.one("#clock"),
		alarms = Y.one("alarms");

	Y.log("Hello World!", "info");
	clock.set("text", Y.Date.format(new Date(), {format: "%T %p"}));

});
