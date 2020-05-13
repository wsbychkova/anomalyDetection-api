(function () {
    "use strict";
  
    const csvFilePath =
      "/Users/elizavetabyckova/Downloads/disser/anomaly-detection-api/cities.csv";
    const server = require("../../server");
    const csv = require("csvtojson");
    const moment = require("moment");
    const Covid = server.main.model("Covid");
  
    // function compareWithDateFormat(date) {
    //   const dateList = [];
    //   for (let key in date) {
    //     const time = moment(key).format();
    //     if (time !== 'Invalid date') {
    //       const dateObject = {
    //         date: time,
    //         value: Number(date[key])
    //       }
    //       dateList.push(dateObject)
    //     }
    //   }
    //   return dateList;
    // }
  
    async function parseCOVID(req, res, next) {
      try {
        const covidFindings = await csv().fromFile(csvFilePath);
        console.log('covidFindings :>> ', covidFindings);
        // const newCovidData = await Covid.create(
        //   covidFindings.map(covid => {
        //     // const data = compareWithDateFormat(covid)
        //     const maxValue = Math.max.apply(Math, data.map((o) => o.value))
        //     return {
        //       province: covid['Province/State'],
        //       country: covid['Country/Region'],
        //       coordinates: { lat: covid['Lat'], long: covid['Long'] },
        //       observed_data: data,
        //       totalValue: maxValue
        //     }
        //   })
        // )
        // res.status(200).send(newCovidData);
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
  