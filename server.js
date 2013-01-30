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
var fs = require('fs'),
	path = require('path'),
	http = require('http'),
	url = require('url'),
	opt = require('opt'),
	YUI = require('yui').YUI;

var config = {
		hostname: "localhost",
		port: "3000",
		static_content: {
			"/": "htdocs/index.html",
			"/index.html": "htdocs/index.html",
			"/about.html": "htdocs/about.html",
			"/status.html": "htdocs/status.html",
			"/js/rclock.js": "htdocs/js/rclock.js",
			"/css/rclock.css": "htdocs/js/rclock.css",
			"/favicon.ico": "htdocs/img/favicon.ico",
			"/img/icon-16.png": "htdocs/img/icon-16.png",
			"/img/icon-48.png": "htdocs/img/icon-48.png",
			"/img/icon-128.png": "htdocs/img/icon-128.png"
		}
	};

if (process.env.PORT) {
	config.port = process.env.PORT
}

http.createServer(function (request, response) {
	if (request.url) {
		YUI().use(function (Y) {
			var html = "Hello World";
			
			Y.log(request.url);
			response.writeHead(200, {
				"Content-Size": html.length,
				"Content-Type": "text/html"
			});
			response.end(html);
		});
	}
}).listen(config.port, config.hostname);
