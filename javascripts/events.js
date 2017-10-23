"use strict";

const owm = require("./owm");
const dom = require("./dom");

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

module.exports = {pressEnter, pressSearch, daysChosen};