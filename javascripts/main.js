"use strict";

let events = require("./events");
let apiKeys = require("./apiKeys");

apiKeys.retrieveKeys();
events.pressSearch();
events.pressEnter();
