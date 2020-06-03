(function () {
  "use strict";

  const server = require("../../server");
  const csv = require("csvtojson");
  const moment = require("moment");
  const CovidRussia = server.main.model("CovidRussia");

  async function parseCOVID(req, res, next) {
    try {
      const cityInfo = await csv().fromFile('data/Таблица_2020-05-25_15-42.csv');
      const regions = await csv().fromFile('data/regions.csv');
      const city = cityInfo.map(city => {
        const date = moment(city['Дата'], 'DD.MM.YYYY').format();
        for (let i = 0; i < regions.length; i++) {
          if (city['Регион'] === regions[i].region) {
            return {
              region: city['Регион'],
              general_city: regions[i].administrativeCenter,
              coordinates: { lat: regions[i].coordinates__lat, lng: regions[i].coordinates__lng },
              observed_date: date,
              population: regions[i].population,
              infected: city['Заражений'],
              infectedPerDay: city['Заражений за день']
            }

          }
        }
      }).filter(city => city !== undefined)

      const russiaInfo = await CovidRussia.create(city)

      res.status(200).send(russiaInfo);
    } catch (err) {
      res.status(400).send(err);
    }
  }

  async function getCOVID(req, res, next) {
    try {
      const covid = await CovidRussia.find();
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
