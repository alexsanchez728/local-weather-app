(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

const owm = require("./owm");
const firebaseApi = require("./firebaseapi");

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
		firebaseApi.setKey(results.firebaseKeys);
		firebase.initializeApp(results.firebaseKeys);
	}).catch((error) => {
			console.log("error", error);
	});
};

module.exports = {retrieveKeys};
},{"./firebaseapi":4,"./owm":6}],2:[function(require,module,exports){
"use strict";

let chosenLength;
let weatherArray;

const setWeatherArray = (weather, divName, arrayLength, search) => {
	weatherArray = weather;
	chosenLength = arrayLength;
	clearDom(divName);
	domString(weatherArray, divName, chosenLength, search);
};


//Do I need divName here??
const showChosenNumberOfDays = (numberOfDays, divName, search) => {
	chosenLength = numberOfDays;
	clearDom(divName);
	domString(weatherArray, divName, chosenLength, search);
};

const domString = (weatherArray, divName, days, search) => {
	let domStrang = "";

	domStrang +=	`<div class="container-fluid">`;

	if (search) {
		domStrang +=		`<h3 class="text-center" id="cityName">For Zipcode: "${$('#search-input').val()}"</h3>`;
	}

	for (let i=0; i<chosenLength; i++) {

		if (i % 3 === 0) {
			domStrang +=	`<div class="row">`;
			}

		domStrang +=			`<div class="col-sm-3 weatherCard">`;
		domStrang +=				`<div class="thumbnail text-center">`;
		if (!search) {
			domStrang +=				`<button class="btn btn-default delete" data-firebase-id="${weatherArray[i].id}">X</button>`;
		}
		domStrang +=					`<div class="info" id="weatherInfo">`;
		domStrang +=					`<h4 id="date" class="date">${new Date(weatherArray[i].dt_txt).toLocaleDateString()}</h4>`;
		domStrang +=					`<p class="highTemp">High of ${weatherArray[i].main.temp_max}&deg F</p>`;
		domStrang +=					`<p class="lowTemp">Low of ${weatherArray[i].main.temp_min}&deg F</p>`;
		domStrang +=					`<p class="humidity">Humidity: ${weatherArray[i].main.humidity}&#37</p>`;
		domStrang +=					`<p class="conditions sr-only">${weatherArray[i].weather[0].description}</p>`;
		domStrang +=					`<p class="condiitonsIcon"><img src="http://openweathermap.org/img/w/${weatherArray[i].weather[0].icon}.png"></p>`;
		domStrang +=					`<p class="air-pressure">Air pressure: ${weatherArray[i].main.pressure} hpa</p>`;
		domStrang +=					`<p class="wind-speed">Wind speed: ${weatherArray[i].wind.speed} m/s</p><p class="wind-direction"> at ${weatherArray[i].wind.deg}</p>`;

		if(search) {

			domStrang +=					`<p>`;
			domStrang +=						`<a class="btn btn-default favWeather" role="button">Save This Day!</a>`;
			domStrang +=					`</p>`;
		}

		domStrang +=					`</div>`;
		domStrang +=				`</div>`;
		domStrang +=			`</div>`;
				if (i % 3 === 2 || i === chosenLength - 1) {
			domStrang +=	`</div>`;
		}
	}
	domStrang +=		`</div>`;
	printToDom(domStrang, divName, search);
};

const printForecastOptions = () => {

	let timeStamp = new Date().toLocaleTimeString();
	// maybe put this in the index with a hide class??
	$("#days").html (
	`<div class="container">
	  <div class="row">
	 	 <div class=" col-xs-12">
  		 <div class="well">
				<div class="btn-group col-xs-offset-3" role="group" id="days">
					<button type="button" class="btn btn-default" name="one day" id="one-day">Today's forecast</button>
					<button type="button" class="btn btn-default" id="three-day">3 day forecast</button>
					<button type="button" class="btn btn-default" id="five-day">5 day forecast</button>
					<p class="text-center">Last Updated: ${timeStamp}</p>

					<div>
					  <button class="btn btn-lg btn-default col-sm-offset-4" id="facebookButton">
   						<img class="social-icon" src="./images/facebook.png">
  					</button>
					  <button class="btn btn-lg btn-default" id="twitterButton">
   						<img class="social-icon"  src="./images/twitter.jpg">
  					</button>
					</div>

	 			</div>
	 		</div>
	 	</div>
	 </div>`
	);
};

const printToDom = (strang, divName, search) => {
	$(`#${divName}`).append(strang);

	if (search) {
		printForecastOptions();
	}
};

const clearDom = (divName) => {
	$(`#${divName}`).empty();
};

const printError = () => {
	clearDom("output");

	let userError = "";
		userError += `<div class="row">`;
		userError += `<div class="alert alert-danger text-center col-xs-6 col-xs-offset-3" role="alert">Sorry, I only accept valid 5 digit US zip codes. ¯\\\_(ツ)_/¯</div>`;
		userError += `</div>`;
	$("#output").append(userError);
};




module.exports = {setWeatherArray, clearDom, showChosenNumberOfDays, printError};
},{}],3:[function(require,module,exports){
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
			
			dom.showChosenNumberOfDays(currentChoiceNumber, "output", true);
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
				// console.log("results from get the weather", results);
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
			$("#days").removeClass("hide");
		} else if (e.target.id === "mine") {
			// // This should rerun the get method from our search, so the user doesn't have to reload to show changes
			getTheWeather();

			$("#search").addClass("hide");
			$("#myWeather").removeClass("hide");
			$("#authScreen").addClass("hide");
			$("#days").addClass("hide");
		} else if (e.target.id === "authenticate") {
			$("#search").addClass("hide");
			$("#myWeather").addClass("hide");
			$("#authScreen").removeClass("hide");
			$("#days").addClass("hide");
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



const favEvents = () => {
	$("body").on("click", ".favWeather", (e) => {

		let mommy = e.target.closest(".weatherCard");

		let newFavWeather = {
			"main": {
        "temp_min": $(mommy).find(".lowTemp").html(),
        "temp_max": $(mommy).find(".highTemp").html(),
        "pressure": $(mommy).find(".air-pressure").html(),
        "humidity": $(mommy).find(".humidity").html(),
			},
	      "weather": [{
        "id": $(mommy).find(".temp_max").html(),
        "description": $(mommy).find(".conditions").html(),
        "icon": $(mommy).find(".condiitonsIcon").html(),
      }],
      "wind": {
        "speed": $(mommy).find(".wind-speed").html(),
        "deg": $(mommy).find(".wind-direction").html(),
      },
      "dt_txt": $(mommy).find(".date").html(),
			"uid":"",
		};

		firebaseApi.saveFavDay(newFavWeather).then((results) => {
			$(mommy).remove();
		}).catch((err) => {
			console.log("error in saveFavDay", err);
		});

	});
};

const deleteFav = () => {
	$("body").on("click", ".delete", (e) => {
		let dayId = $(e.target).data("firebase-id");

		firebaseApi.deleteFavDay(dayId).then(() => {
			getTheWeather();
		}).catch((err) => {
			console.log("error in delete movie", err);
		});
	});
};



const init = () => {
	pressEnter();
	pressSearch();
	daysChosen();
	googleAuth();
	myLinks();
	favEvents();
	deleteFav();
};



module.exports = {init};
},{"./dom":2,"./firebaseapi":4,"./owm":6}],4:[function(require,module,exports){
"use strict";

let firebaseKey = "";
let userUid = "";

const setKey = (key) => {
	firebaseKey = key;
};


let authenticateGoogle = () => {
  return new Promise((resolve, reject) => {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
      .then((authData) => {
      	userUid = authData.user.uid;
        resolve(authData.user);
      }).catch((error) => {
          reject(error);
      });
  });
};

const getWeatherList = () => {
  let userWeather = [];
  return new Promise((resolve, reject) => {
    $.ajax(`${firebaseKey.databaseURL}/weather.json?orderBy="uid"&equalTo="${userUid}"`).then((weather) => {
    // had to hard code userId in weather.json for ^^ to work
            // console.log("weather results", weather);
            // console.log("userUid", userUid);
      if (weather != null){
        Object.keys(weather).forEach((key) => {
          weather[key].id = key;
          userWeather.push(weather[key]);
        });
      }
      resolve(userWeather);
    }).catch((err) => {
      reject(err);
    });
  });
};


const saveFavDay = (daysWeather) => {
  daysWeather.uid = userUid;
  return new Promise((resolve, reject) => {
    $.ajax({
      method: "POST",
      url: `${firebaseKey.databaseURL}/weather.json`,
      data: JSON.stringify(daysWeather)
    }).then((result) => {
      resolve(result);
    }).catch((err) => {
      reject(err);
    });
  });
};

const deleteFavDay = (weatherId) => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: "DELETE",
      url: `${firebaseKey.databaseURL}/weather/${weatherId}.json`
    }).then((weather) => {
      resolve(weather);
    }).catch((err) => {
      reject(err);
    });
  });
};


module.exports = {setKey, authenticateGoogle, getWeatherList, saveFavDay, deleteFavDay};
},{}],5:[function(require,module,exports){
"use strict";

let events = require("./events");
let apiKeys = require("./apiKeys");

apiKeys.retrieveKeys();
events.init();
},{"./apiKeys":1,"./events":3}],6:[function(require,module,exports){
"use strict";

let owmKey;
const dom = require("./dom");

const searchOwm = (query) => {
	return new Promise((resolve, reject) => {
		$.ajax(`http://api.openweathermap.org/data/2.5/forecast?zip=${query},us&appid=${owmKey}&units=imperial`).done((data) => {
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
		dom.printError();
	});
};

const setKeys = (apiKey) => {
	owmKey = apiKey;
};

const showResults = (weatherArray) => {

	let fiveDayForecast = [];

	for (let i=0; i<weatherArray.list.length; i++) {
		if (i === 0 ||i ===  8 || i === 16 ||i ===  24 ||i === 32) {
			fiveDayForecast.push(weatherArray.list[i]);
		}
	}
	dom.clearDom('output');

	// just get all 5 days in 3h format, store em in search-input, only show what the user asks for
	// every 8th object is pushed to a new array to be used
	// That way I can minimize the calls I make to the API

	dom.setWeatherArray(fiveDayForecast, "output", 1, true);
};

module.exports = {setKeys, searchWeather};
},{"./dom":2}]},{},[5]);
