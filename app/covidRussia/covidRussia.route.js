(function() {
    "use strict";
  
    let covidRussia = require("./covidRussia.controller");
  
    module.exports = function(app) {
      // app.get("/api/covidRussia", covidRussia.parseCOVID);
      app.get("/api/covidRussia", covidRussia.getCOVID);
    };
  })();
  