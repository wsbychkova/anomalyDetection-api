(function() {
    "use strict";
  
    let machineLearning = require("./machine_learning.controller");
  
    module.exports = function(app) {
      app.get("/api/svm_train", machineLearning.svmTrain);
      app.get("/api/random_forest_train", machineLearning.randomForestTrain);
    };
  })();
  