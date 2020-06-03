(function() {
  "use strict";

  let covid = require("./covid.controller");

  module.exports = function(app) {
    // app.get("/api/covid", covid.parseCOVID);
    app.get("/api/covid", covid.getCOVID);
  };
})();
