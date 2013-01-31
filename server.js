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
	opt = require('opt').create(),
	mimetype = require("mimetype"),
	YUI = require('yui').YUI;

var config = {
		hostname: process.env.HOSTNAME || "localhost",
		port: process.env.PORT || 3000,
		static_content: {
			"/": "htdocs/index.html",
			"/index.html": "htdocs/index.html",
			"/about.html": "htdocs/about.html",
			"/status.html": "htdocs/status.html",
			"/js/rclock.js": "htdocs/js/rclock.js",
			"/css/rclock.css": "htdocs/js/rclock.css",
			"/favicon.ico": "htdocs/favicon.ico",
			"/img/icon-16.png": "htdocs/img/icon-16.png",
			"/img/icon-48.png": "htdocs/img/icon-48.png",
			"/img/icon-128.png": "htdocs/img/icon-128.png"
		}
	},
	static_content = {};

var update = function (route, filename) {
	if (static_content[route] === undefined) {
		static_content[route] = {
			src: "",
			size: 0,
			mime_type: "text/plain"
		};
		static_content[route].mime_type = mimetype.lookup(filename);
	}
	fs.readFile(filename, function (err, buf) {
		if (err) {
			console.error(err);
			return;
		}
		if (static_content[route].mime_type.indexOf("text/") === 0) {
			static_content[route].src = buf.toString();
			static_content[route].size = static_content[route].src.length;
		} else {
			static_content[route].src = buf;
			static_content[route].size = buf.length;
		}
		console.log("Updated", route, "from", filename, static_content[route].mime_type);
	});
};

var update = function (route, filename) {
	if (static_content[route] === undefined) {
		static_content[route] = {
			src: "",
			size: 0,
			mime_type: "text/plain"
		};
		static_content[route].mime_type = mimetype.lookup(filename);
	}
	fs.readFile(filename, function (err, buf) {
		if (err) {
			console.error(err);
			return;
		}
		if (static_content[route].mime_type.indexOf("text/") === 0) {
			static_content[route].src = buf.toString();
			static_content[route].size = static_content[route].src.length;
		} else {
			static_content[route].src = buf;
			static_content[route].size = buf.length;
		}
		console.log("Updated", route, "from", filename, static_content[route].mime_type);
	});
};

var monitor = function (route, filename) {
	if (static_content[route] === undefined) {
		console.log("Loading", route, "from", filename);
		update(route, config.static_content[route]);
	}
	fs.watchFile(filename, function (curr, prev) {
		if (curr.mtime !== prev.mtime) {
			console.log("Queued", route, "from", filename);
			update(route, filename);
		}
	});
};

var sanity_check = function (configuration) {
	var minimum_config = [ 'port', 'static_content' ];
	
	minimum_config.forEach(function (ky) {
		if (config[ky] === undefined) {
			opt.usage("Missing configuration for " + ky, 1); 
		}
	});
	if (Object.keys(config.static_content).length < 1) {
		opt.usage("No static content defined.", 1);
	}
};

opt.config(config, [ "/etc/rclock" ]);
opt.consume(true);

opt.optionHelp("USAGE: " + path.basename(process.argv[1]),
	"SYNOPSIS: a simple webserver to deploy rclock browser based app.",
	"OPTIONS:",
	"copyright (c) 2013, R. S. Doiel\n All rights reservered.\n Released under the BSD 2 Clause license\n See: http://opensource.org/licenses/BSD-2-Clause");

opt.option(["-c", "--config"], function (param) {
	var src;
	
	if (param) {
		try {
			src = fs.readFileSync(param).toString();
		} catch (e) {
			opt.usage(e.msg, 1);
		}
		config = JSON.parse(src);
		if (!config) {
			opt.usage("Can't process " + param, 1);
		}
		opt.consume(param);
	}
}, "Use a specific config file.");

opt.option(["-H", "--hostname"], function (param) {
	if (param) {
		config.hostname = param;
		opt.consume(param);
	}
}, "Set the hostname to listen to.");

opt.option(["-p", "--port"], function (param) {
	if (param && Number(param)) {
		config.port = Number(param);
		opt.consume(param);
	}
}, "Set the port to listen on.");

opt.option(["-r", "--routes"], function (param) {
	var src;
	
	if (param) {
		try {
			src = fs.readFileSync(param).toString();
		} catch (e) {
			opt.usage(e.msg, 1);
		}
		
		config.static_content = JSON.parse(src);
		if (!config.static_content) {
			opt.usage("Could not process " + param, 1);
		}
		opt.consume(param);
	}
}, "A file containing JSON object mapping explicit routes to a static files on disc (e.g. {\"/\": \"htdocs/index.html\"}).");

opt.option(["-h", "--help"], function () {
	opt.usage();
}, "This help page.");

opt.optionWith(process.argv);
sanity_check(config);

Object.keys(config.static_content).forEach(function (route) {
	monitor(route, config.static_content[route]);
});

http.createServer(function (request, response) {
	if (request.url) {
		YUI().use(function (Y) {
			var html = "Not found.", parts = url.parse(request.url, true);

			if (static_content[parts.pathname] === undefined) {
				Y.log("404 " + request.url, "warning");
				response.writeHead(404, {
					'Content-Size': html.length,
					'Content-Type': 'text/plain'
				});
				response.end(html);
			} else {
				Y.log("200 " + request.url, "info");
				html = static_content[parts.pathname];
				response.writeHead(200, {
					"Content-Size": html.length,
					"Content-Type": "text/html"
				});
				response.end(html);
			}
		});
	}
}).listen(config.port, config.hostname);

