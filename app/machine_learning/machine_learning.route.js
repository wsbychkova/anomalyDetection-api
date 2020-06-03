(function() {
    "use strict";
  
    let machineLearning = require("./machine_learning.controller");
  
    module.exports = function(app) {
      app.get("/api/machine_learning", machineLearning.train);
    };
  })();
  