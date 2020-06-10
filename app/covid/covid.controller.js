(function () {
  "use strict";

  const server = require("../../server");
  const csv = require("csvtojson");
  const moment = require("moment");
  const Covid = server.main.model("Covid");

  async function parseCOVID(req, res, next) {
    try {
      const cities = await csv().fromFile('data/owid-covid-data.csv');
      const covidFindings = cities.filter(city => city.location === 'Russia');
      const result = [];
      for (let i = 72; i < covidFindings.length; i++) {
        result.push({
          location: covidFindings[i].location,
          date: new Date(covidFindings[i].date),
          new_cases: Number(covidFindings[i].new_cases),
          total_cases: Number(covidFindings[i].total_cases),
          new_tests: Number(covidFindings[i].new_tests),
          total_tests: Number(covidFindings[i].total_tests)
        })
      }
      const newCovidData = await Covid.create(result)
      res.status(200).send(newCovidData);
    } catch (err) {
      res.status(400).send(err);
    }
  }

  async function getCOVID(req, res, next) {
    try {
      const covid = await Covid.find();
      res.status(200).send(covid);
    } catch (err) {
      res.status(400).send(err);
    }
  }

  module.exports = {
    parseCOVID,
    getCOVID
  };
})();
