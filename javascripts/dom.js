"use strict";

let chosenLength = 1;
let weatherArray;


const runDomString = () => {
	clearDom();
	domString(weatherArray, chosenLength);
};

const domString = (weatherArray, days) => {
	let domStrang = "";

		domStrang +=	`<div class="container-fluid">`;
		domStrang +=		`<h3 class="text-center" id="cityName">For Zipcode: "${$('#search-input').val()}"</h3>`;

	for (let i=0; i<chosenLength; i++) {

		if (i % 3 === 0) {
			domStrang +=	`<div class="row">`;
			}

		domStrang +=			`<div class="col-sm-3">`;
		domStrang +=				`<div class="thumbnail text-center" id="weatherCard">`;
		domStrang +=					`<div class="info" id="weatherInfo">`;
		domStrang +=					`<h4 id="date">${weatherArray[i].dt_txt}</h4>`;
		domStrang +=						`<p>Temperature: ${weatherArray[i].main.temp}&deg F</p>`;
		domStrang +=						`<p>Conditions:<img src="http://openweathermap.org/img/w/${weatherArray[i].weather[0].icon}.png"></p> `;
		domStrang +=						`<p>Air pressure: ${weatherArray[i].main.pressure} hpa</p>`;
		domStrang +=						`<p>Wind speed: ${weatherArray[i].wind.speed} m/s</p>`;
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

const printForecastOptions = () => {

	let timeStamp = new Date().toLocaleTimeString();

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
	 			</div>
	 		</div>
	 	</div>
	 </div>`
	);
};

const printToDom = (strang) => {
	$("#output").append(strang);
	printForecastOptions();
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

const printError = () => {
	clearDom();

	let userError = "";
		userError += `<div class="row">`;
		userError += `<div class="alert alert-danger text-center col-xs-6 col-xs-offset-3" role="alert">Sorry, I only accept valid 5 digit US zip codes. ¯\\\_(ツ)_/¯</div>`;
		userError += `</div>`;
	$("#output").append(userError);
};




module.exports = {setWeatherArray, clearDom, showChosenNumberOfDays, printError};