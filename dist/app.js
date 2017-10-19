(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

const owm = require("./owm");

const apiKeys = () => {
	return new Promise((resolve, reject) => {
		$.ajax("./db/apiKeys.json").done((data) => {
			resolve(data.apiKeys);
		}).fail((error) => {
			reject(error);
		});
	});
};

const retrieveKeys = () => {
	apiKeys().then((results) => {
		owm.setKeys(results.owm.apiKey);
	}).catch((error) => {
			console.log("error", error);
	});
};

module.exports = {retrieveKeys};
},{"./owm":4}],2:[function(require,module,exports){
"use strict";

const owm = require("./owm");

const pressEnter = () => {
	$(document).keypress((event) => {
		if (event.key === "Enter") {
			// let searchText = $("#search-bar").val();
			// owm.searchMovies(searchText);
			owm.searchWeather(90210);
		} 
	});


};

module.exports = {pressEnter};
},{"./owm":4}],3:[function(require,module,exports){
"use strict";

let events = require("./events");
let apiKeys = require("./apiKeys");

apiKeys.retrieveKeys();
// apiKeys.apiKeys();
events.pressEnter();
},{"./apiKeys":1,"./events":2}],4:[function(require,module,exports){
"use strict";

let owmKey;
// const dom = require("./dom");

const searchOwm = (query) => {
	return new Promise((resolve, reject) => {
		console.log("my key", owmKey);
		console.log("my query", query);
		$.ajax(`http://api.openweathermap.org/data/2.5/weather?zip=${query},us&appid=${owmKey}&units=imperial`).done((data) => {
			resolve(data);
			console.log("direct from searchOwm", data);
		}).fail((error) => {
			reject(error);
		});
	});
};

// const tmdbConfiguration = () => {
// 	return new Promise((resolve, reject) => {
// 		$.ajax(`https://api.themoviedb.org/3/configuration?api_key=${tmdbKey}`).done((data) => {
// 			resolve(data.images);
// 		}).fail((error) => {
// 			reject(error);
// 		});
// 	});
// };

// const getConfig = () => {
// 	tmdbConfiguration().then((results) => {
// 		imgConfig = results;
// 		console.log("img info", imgConfig);
// 	}).catch((error) => {
// 		console.log("error in getConfig", error);
// 	});
// };

const searchWeather = (query) => {
	searchOwm(query).then((data) => {
			// showResults(data);
			console.log("from searchWeather", data);
	}).catch((error) => {
		console.log("error in search weather", error);
	});
};

const setKeys = (apiKey) => {
	owmKey = apiKey;
	console.log("api key", owmKey);
};

// const showResults = (movieArray) => {
// 	dom.clearDom();
// 	dom.domString(movieArray, imgConfig);
// };

module.exports = {setKeys, searchWeather};
},{}]},{},[3]);
