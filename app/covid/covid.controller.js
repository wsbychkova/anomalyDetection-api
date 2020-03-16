(function () {
  "use strict";

  const csvFilePath =
    "/Users/elizavetabyckova/Downloads/disser/anomaly-detection-api/time_series_covid_19_confirmed.csv";
  const server = require("../../server");
  const csv = require("csvtojson");
  const Covid = server.main.model("Covid");

  function compareWithDateFormat(date) {
    // console.log('date :', Object.keys(date));

    var regex = /^[0-9]{2}[\/][0-9]{2}[\/][0-9]{4}$/g;
    // var succsessDate=regex.test(date);
    // "22-03-1981".match(dateReg) // matches
    console.log(date + " matches with regex?");
    console.log(regex.test(Object.keys(date)));

    return date;
  }

  async function getCOVID(req, res, next) {
    try {
      const covidFindings = await csv().fromFile(csvFilePath);
      const newCovidData = await Covid.create(
        covidFindings.map(covid => {
          compareWithDateFormat(covid)
          // console.log('covid :', covid['1/22/20']);
          // const timestamp_data = {
          //   time: covid[],
          //   data:
          // }
        //  const regExp = `^(((0[1-9]|[12]\d|3[01])\/(0[13578]|1[02])\/((19|[2-9]\d)\d{2}))|((0[1-9]|[12]\d|30)\/(0[13456789]|1[012])\/((19|[2-9]\d)\d{2}))|((0[1-9]|1\d|2[0-8])\/02\/((19|[2-9]\d)\d{2}))|(29\/02\/((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|(([1][26]|[2468][048]|[3579][26])00))))$`
          // if (covid[regExp]) {
          //   console.log('object :', covid[regExp]);
          // }
          return {
            province: covid['Province/State'],
            country: covid['Country/Region'],
            coordinates: { lat: covid['Lat'], long: covid['Long'] },
            observed_data: []
          }
        })
      )
      // console.log('newCovidData :', newCovidData);

      res.status(200).send(covidFindings);
    } catch (err) {
      res.status(400).send(err);
    }
  }

  module.exports = {
    getCOVID
  };
})();
