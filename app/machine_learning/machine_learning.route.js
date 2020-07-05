(function () {
  "use strict";

  let machineLearning = require("./machine_learning.controller");

  module.exports = function (app) {
    app.post("/api/hybrid_anomaly_detection", machineLearning.hybridAnomalyDetection);
  };
})();
