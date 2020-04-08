(function () {
    "use strict";

    var plotly = require('plotly')("eli.bychkova", "SifvqMMyBVJPmNQYrbhI");
    const server = require("../../server");
    const Covid = server.main.model("Covid");


    async function getMatrix(req, res, next) {
        const covid = await Covid.find();
        let cities = []
        if (covid) {
            cities = covid.filter(city => city.province === 'Henan'
                || city.province === 'Hubei'
                || city.province === 'Guangdong'
                || city.province === "Zhejiang"
            )
        }

        try {

            const z_map = new Array(50).fill([])
            const emptyX = new Array(31).fill(0)

            for (let i in z_map) {
                z_map[i] = emptyX
            }

            //z_map - Это полная матрица, состоящая из массивов (у) в массиве
            //каждый у - это массив иксов. 
            //1-е необходимо заполнить массив массивами из у
            //Находим индекс в z равный lat. 

            const newZ = z_map.map((y, index) => {
                const citiesFilter = cities.filter(city => {
                    const lat = Math.round(city.coordinates.lat);
                    if (lat === index + 1) return y;
                }).map(city => {
                    const long = Math.round(city.coordinates.long);
                    return y.map((os_x, index) => (long === (index + 100)) ? city.observed_data[0].value : 0)
                })
                return citiesFilter.length !== 0 ? citiesFilter[0] : y

            })

            var data = [
                {
                    z: newZ,
                    type: "surface"
                }
            ];
            var layout = {
                title: "Covid-19",
                autosize: true,
                width: '1000px',
                height: '1000px'
            };
            var graphOptions = { layout: layout, filename: "elevations-3d-surface", fileopt: "overwrite" };
            plotly.plot(data, graphOptions, function (err, msg) {
                res.status(200).send(msg);
            });

        } catch (err) {
            res.status(400).send(err);
        }
    }

    module.exports = {
        getMatrix
    };
})();
