(function () {
  "use strict";

  const csvFilePath = ('/Users/elizavetabyckova/Downloads/disser/anomaly-detection-api/time_series_covid_19_confirmed.csv')

  const csv = require('csvtojson')

  // const Buildings = require("../models/buildings.model");
  // const FloorsData = require("../models/floorsData.model");
  // const UserModel = require("../authentication/auth.controller");

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
