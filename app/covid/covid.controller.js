(function() {
  "use strict";

  const csvFilePath =
    "/Users/elizavetabyckova/Downloads/disser/anomaly-detection-api/time_series_covid_19_confirmed.csv";
  const server = require("../../server");
  const csv = require("csvtojson");
  // const Covid = server.main.model("Covid");

  async function getCOVID(req, res, next) {
    try {
      const covid = await csv().fromFile(csvFilePath);
      res.status(200).send(covid);
    } catch (err) {
      res.status(400).send(err);
    }
  }

  module.exports = {
    getCOVID
  };
})();
