(function() {
    "use strict";
  
    let matrix = require("./matrix.controller");

    module.exports = function(app) {
      app.get("/api/matrix", matrix.getMatrix);
    };
  })();
  