(function() {
    "use strict";
  
    let calculation = require("./calculation.controller");

    module.exports = function(app) {
      app.get("/api/regression", calculation.getRegression);
    };
  })();
  