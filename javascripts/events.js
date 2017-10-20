"use strict";

const owm = require("./owm");
const dom = require("./dom");

const pressEnter = () => {
	$(document).keypress((event) => {
		if (event.key === "Enter") {
			// let searchText = $("#search-bar").val();
			// owm.searchWeather(searchText);
			owm.searchWeather(90210);
			daysChosen();
		} 
	});

};

const daysChosen = () => {
	$(document).click((e) => {
		// only run when the buttons are clicked
		if (e.target.className === "btn btn-default") {

			let currentChoiceFromDom = e.target.id;

			// using the id name set the corresponding number of days to show up
			let currentChoiceNumber = (currentChoiceFromDom === "one-day" ? 1 : currentChoiceFromDom === "three-day" ? 3 : 7);
			
			// And re-run the dom function showing the correct number of days chosen, using the same zip search.
			dom.showChosenNumberOfDays(currentChoiceNumber);
		}
	});
};



module.exports = {pressEnter, daysChosen};