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
                || city.province === 'Guangdong'
            )
        }



        console.log('cities :', cities);
        try {

            const z_map = [];
            let x_map = []
            let y_map = []

            for (let i = 100; i < 130; i++) x_map.push(i.toString())
            for (let i = 0; i < 50; i++) y_map.push(i.toString())

            // z_map[0] = new Array(x_map.length)
            for (let i = 0; 1< x_map.length; i++) {
                z_map[0].push(0)
            }
            
            // for (let key in z_map[0]) {
            //     console.log('z_map[0][key] :', z_map[0][key]);
            // }
            // z_map[0].map((item, index) => {
            //     z_map[0][index] = 0;
            //     z_map[0][5] = 22;
            // })

            console.log('z_map :', z_map);

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
