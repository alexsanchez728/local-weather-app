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