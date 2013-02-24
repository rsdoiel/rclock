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
	path = require('path'),
	YUI = require('yui').YUI,
	port = process.env.PORT || 3000,
    host = process.env.HOPSTNAME || process.env.IP || "localhost";


YUI().use("io-base", function (Y) {
	var server = express();

	server.use(express.logger());
	server.use(express.static(path.join(__dirname, "htdocs")));
	server.listen(port, host);
	Y.log("Starting up web server on port " + host + ":" + port, "info");
});


