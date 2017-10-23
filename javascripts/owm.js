"use strict";

let owmKey;
const dom = require("./dom");

const searchOwm = (query) => {
	return new Promise((resolve, reject) => {

		$.ajax(`http://api.openweathermap.org/data/2.5/forecast?zip=${query},us&appid=${owmKey}&units=imperial&cnt=5`).done((data) => {
			// 					 api.openweathermap.org/data/2.5/forecast/daily?zip={zip code},{country code}
			resolve(data);
			console.log(data);
		}).fail((error) => {
			reject(error);
		});
	});
};

const searchWeather = (query) => {
	searchOwm(query).then((data) => {
			showResults(data);
	}).catch((error) => {
		console.log("error in search weather", error);
		dom.printError();
	});
};

const setKeys = (apiKey) => {
	owmKey = apiKey;
};

const showResults = (weatherArray) => {
	dom.clearDom();

	// just get all 5 days, store em in setWeatherArray, only show what the user asks for
	// That way I can minimize the calls I make to the API

	dom.setWeatherArray(weatherArray);
};

module.exports = {setKeys, searchWeather};