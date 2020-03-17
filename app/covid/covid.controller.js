(function () {
  "use strict";

  const csvFilePath =
    "/Users/elizavetabyckova/Downloads/disser/anomaly-detection-api/time_series_covid_19_confirmed.csv";
  const server = require("../../server");
  const csv = require("csvtojson");
  const moment = require("moment");
  const Covid = server.main.model("Covid");

  function compareWithDateFormat(date) {
    const dateList = [];
    for (let key in date) {
      const time = moment(key).format();
      if (time !== 'Invalid date') {
       const dateObject = {
          date: time,
          value: date[key]
        }
        dateList.push(dateObject)
      } 
      }
    return dateList;
  }

  async function getCOVID(req, res, next) {
    try {
      const covidFindings = await csv().fromFile(csvFilePath);
      const newCovidData = await Covid.create(
        covidFindings.map(covid => {
          const data = compareWithDateFormat(covid)
          return {
            province: covid['Province/State'],
            country: covid['Country/Region'],
            coordinates: { lat: covid['Lat'], long: covid['Long'] },
            observed_data: data
          }
        })
      )
      res.status(200).send(newCovidData);
    } catch (err) {
      res.status(400).send(err);
    }
  }

  module.exports = {
    getCOVID
  };
})();
