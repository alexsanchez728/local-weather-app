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