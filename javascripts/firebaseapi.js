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
      if (weather != null){
        Object.keys(weather).forEach((key) => {
          weather[key].id = key;
          userWeather.push(weather[key]);
        });
      }
      resolve(userWeather);
      console.log("user weather", userWeather);
    }).catch((err) => {
      reject(err);
    });
  });
};

module.exports = {setKey, authenticateGoogle, getWeatherList};