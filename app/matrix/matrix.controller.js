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
            const emptyX = new Array(30).fill(0)

            console.log('emptyX :', emptyX);
            const testX = []
            let x_map = []
                        
            for (let i = 100; i < 131; i++) testX.push(i)

            for (let i in z_map) {
                z_map[i] = testX
            }

            z_map.map((os_y, index) => {
                return cities.map(city => {
                    const lat = Math.round(city.coordinates.lat);
                    const long = Math.round(city.coordinates.long);
                    if ((lat - 1) === index) {
                        const arr1 = os_y.map((os_x, index) => {
                            // console.log('long-1 :', long-1);
                            // console.log('index :', index);
                            if ((long - 1) === os_x) {
                                return city.observed_data[0].value
                            } else return 0
                        })
                        return arr1;
                    }  else return  emptyX
                })
            })

console.log('z_map :', z_map);

            // console.log('testY :', testY);
            // const arr = y_map.map((y) => {
            //     return cities.map(city => {
            //         if (Math.round(city.coordinates.lat) === y) {
            //             return [city.observed_data[0].value]
            //         } 
            //     })
            // })
            // x_map.map((x) => {
            //     if (Math.round(city.coordinates.long) === x) {
            //         return city.observed_data[0].value
            //         // testX.push(city.observed_data[0].value)
            //     } else {
            //         return 0
            //     }
            // })

            // console.log('arr :', arr);
            // for (let key in z_map[0]) {
            //     console.log('z_map[0][key] :', z_map[0][key]);
            // }
            // z_map[0].map((item, index) => {
            //     z_map[0][index] = 0;
            //     z_map[0][5] = 22;
            // })

            // console.log('newmap :', newmap);

            var data = [
                {
                    z: z_map,
                    x: x_map,
                    y: y_map,
                    type: "surface"
                }
            ];
            var layout = {
                title: "Mt Bruno Elevation",
                autosize: true,
                width: '1000px',
                height: '1000px'
            };
            var graphOptions = { layout: layout, filename: "elevations-3d-surface", fileopt: "overwrite" };
            plotly.plot(data, graphOptions, function (err, msg) {
                res.status(200).send(msg);
            });
            console.log('plotly :', plotly);
        } catch (err) {
            res.status(400).send(err);
        }
    }

    module.exports = {
        getMatrix
    };
})();
