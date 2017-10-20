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
},{"./owm":5}],2:[function(require,module,exports){
"use strict";

// print only the current weather at first
	// when it prints ...
	// ... show an option to show 3, 5, & 7 day forcast
	// when clicked: reprint using their button choice as: i<chosenLength

let chosenLength = 1;
let weatherArray;


const runDomString = () => {
	console.log("weatherArray", weatherArray);
	console.log("how many days of data will show up", chosenLength);

	clearDom();
	domString(weatherArray, chosenLength);
};

const domString = (weatherArray, days) => {
	let domStrang = "";

		domStrang +=	`<div class="container-fluid">`;
	for (let i=0; i<chosenLength; i++) {
		if (i % 3 === 0) {
			domStrang +=	`<div class="row">`;
		}
		// domStrang +=		`<div class="row">`;
		domStrang +=			`<div class="col-sm-3">`;
		domStrang +=				`<div class="thumbnail text-center">`;
		domStrang +=					`<div class="info">`;
		domStrang +=						`<h3>${weatherArray.city.name}</h3>`;
		domStrang +=						`<p>Temperature: ${weatherArray.list[i].main.temp}&deg F</p>`;
		domStrang +=						`<p>Conditions: ${weatherArray.list[i].weather[0].description}</p>`;
		domStrang +=						`<p>Air pressure: ${weatherArray.list[i].main.pressure} hpa</p>`;
		domStrang +=						`<p>Wind speed: ${weatherArray.list[i].wind.speed} m/s</p>`;
		domStrang +=					`</div>`;
		domStrang +=				`</div>`;
		domStrang +=			`</div>`;
				if (i % 3 === 2 || i === chosenLength - 1) {
			domStrang +=	`</div>`;
		}


	}
		domStrang +=		`</div>`;
	printToDom(domStrang);
};

const printToDom = (strang) => {

	$("#output").append(strang);
	$("#days").html (
		`<div class="container"
		  <div class="row">
		 	 <div class=" col-xs-12">
    		 <div class="well">
					<div class="btn-group col-xs-offset-3" role="group" id="days">
						<button type="button" class="btn btn-default" name="one day" id="one-day">Today's forecast</button>
						<button type="button" class="btn btn-default" id="three-day">3 day forecast</button>
						<button type="button" class="btn btn-default" id="seven-day">7 day forecast</button>
		 			</div>
		 		</div>
		 	</div>
		 </div>`
		);
};


const setWeatherArray = (weather) => {
	 weatherArray = weather;
	 runDomString();
};

const showChosenNumberOfDays = (numberOfDays) => {
	chosenLength = numberOfDays;
	runDomString();
};


const clearDom = () => {
	$("#output").empty();
};


module.exports = {setWeatherArray, clearDom, showChosenNumberOfDays};
},{}],3:[function(require,module,exports){
"use strict";

const owm = require("./owm");
const dom = require("./dom");

// const fiveDigitRegex=/^[0-9]+$/;
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



// This function might need clean up aka try not to use such nasty dom traversal
const daysChosen = () => {
	$(document).click((e) => {
		// only run when the buttons are clicked
		if (e.target.parentNode.id === "days") {
		// if (e.target.parentNode.id === "days") {
			console.log("here!");
			let currentChoiceFromDom = e.target.id;

			// using the id name set the corresponding number of days to show up
			let currentChoiceNumber = (currentChoiceFromDom === "one-day" ? 1 : currentChoiceFromDom === "three-day" ? 3 : 7);
			
			// And re-run the dom function showing the correct number of days chosen, using the same zip search.
			dom.showChosenNumberOfDays(currentChoiceNumber);
		}
	});
};

const searchZipcode = () => {
	let searchInput = $("#search-input").val();

	if (searchInput.length === 5 && searchInput.match(usZipCodeRegex)) {
		console.log("you entered a zipcode!");
		owm.searchWeather(searchInput);
		daysChosen();

	}
			// else {
			// 	// dom.printError(notAZip);
			// }
};



module.exports = {pressEnter, daysChosen};
},{"./dom":2,"./owm":5}],4:[function(require,module,exports){
"use strict";

let events = require("./events");
let apiKeys = require("./apiKeys");

apiKeys.retrieveKeys();
// apiKeys.apiKeys();
events.pressEnter();

},{"./apiKeys":1,"./events":3}],5:[function(require,module,exports){
"use strict";

let owmKey;
const dom = require("./dom");

const searchOwm = (query) => {
	return new Promise((resolve, reject) => {
		// console.log("my key made it to searchOwm", owmKey);
		// console.log("my query made it to searchOwm", query);
		$.ajax(`http://api.openweathermap.org/data/2.5/forecast?zip=${query},us&appid=${owmKey}&units=imperial&cnt=7`).done((data) => {
			resolve(data);
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
	});
};

const setKeys = (apiKey) => {
	owmKey = apiKey;
};

const showResults = (weatherArray) => {
	dom.clearDom();

	// just get all 7 days, store em in setWeatherArray, only show what the user asks for
	// That way I can minimize the calls I make to the API

	dom.setWeatherArray(weatherArray);
};

module.exports = {setKeys, searchWeather};
},{"./dom":2}]},{},[4]);
