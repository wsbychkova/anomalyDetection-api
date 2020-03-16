(function() {
  "use strict";

  let covid = require("./covid.controller");

  module.exports = function(app) {
    // app.post("/api/buildings", buildings.createBuildings);
    app.get("/api/covid", covid.getCOVID);
  };
})();
