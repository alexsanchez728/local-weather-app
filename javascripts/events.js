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