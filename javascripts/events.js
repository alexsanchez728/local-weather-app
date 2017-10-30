"use strict";

const owm = require("./owm");
const dom = require("./dom");
const firebaseApi = require("./firebaseapi");

const usZipCodeRegex =/(^\d{5}$)|(^\d{5}-\d{4}$)/;


const pressEnter = () => {
	$(document).keypress((event) => {
		if (event.key === "Enter") {
			searchZipcode();
			} 
	});
};

const pressSearch = () => {
	$("#search-btn").click((event) => {
		searchZipcode();
	});
};

const daysChosen = () => {
	$(document).click((e) => {
		// only run when the buttons are clicked
		if (e.target.parentNode.id === "days") {
			let currentChoiceFromDom = e.target.id;

			// using the id name set the corresponding number of days to show up
			let currentChoiceNumber = (currentChoiceFromDom === "one-day" ? 1 : currentChoiceFromDom === "three-day" ? 3 : 5);
			
			dom.showChosenNumberOfDays(currentChoiceNumber);
		}
	});
};

const searchZipcode = () => {
	let searchInput = $("#search-input").val();

	if (searchInput.match(usZipCodeRegex)) {
		owm.searchWeather(searchInput);
		daysChosen();

	} else {
			dom.printError();
		}
};

const getTheWeather = () => {
			firebaseApi.getWeatherList().then((results) => {
				console.log("results from get the weather", results);
				dom.clearDom('weatherMine');
				dom.setWeatherArray(results, 'weatherMine', results.length, false);
			}).catch((err) => {
				console.log("error in getTheWeather", err);
			});
};


// Add function: myLinks - click events that checks the id of event.target and:
const myLinks = () => {
	$(document).click((e) => {
		if (e.target.id === "navSearch") {
			$("#search").removeClass("hide");
			$("#myWeather").addClass("hide");
			$("#authScreen").addClass("hide");
		} else if (e.target.id === "mine") {
			// // This should rerun the get method from our search, so the user doesn't have to reload to show changes
			getTheWeather();

			$("#search").addClass("hide");
			$("#myWeather").removeClass("hide");
			$("#authScreen").addClass("hide");
		} else if (e.target.id === "authenticate") {
			$("#search").addClass("hide");
			$("#myWeather").addClass("hide");
			$("#authScreen").removeClass("hide");
		}
	});
};



const googleAuth = () => {
	$("#googleButton").click((event) => {
		firebaseApi.authenticateGoogle().then((result) => {
		}).catch((err) => {
			console.log("error in authenticateGoogle", err);
		});
	});
};


const init = () => {
 pressEnter();
 pressSearch();
 daysChosen();
 googleAuth();
 myLinks();
};



module.exports = {init};