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