(function () {
    "use strict";

    var plotly = require('plotly')("eli.bychkova", "SifvqMMyBVJPmNQYrbhI");
    var jssvm = require('js-svm');
    var svm = new jssvm.BinarySvmClassifier();
    const csv = require("csvtojson");
    const data = require('../constants')


    var trainingData = [];
    var testingData = [];

    var svm = new jssvm.BinarySvmClassifier({
        alpha: 0.01,
        iterations: 1000,
        C: 5.0,
        trace: false
    });


    const calcIrwinCriterion = (current, previous, deviation) => {
        return Math.abs(current - previous) / deviation
    }

    async function train(req, res, next) {
        try {
            const data = await csv().fromFile('data/owid-covid-data.csv');
            const filterData = data.filter(city => city.location === 'Russia');
            const allData = []
            filterData.forEach((data, index) => {
                if (index > 72) {
                    allData.push(Number(data.new_cases))
                }
                if (index === 131) allData.push(324)
                if (index === 85) allData.push(7112)
                if (index === 150) allData.push(531)
            })
            let average = 0;
            let dispersia = 0;
            let deviation = 0;

            for (let i = 0; i < allData.length; i++) {
                average += allData[i]
            }
            average = average / allData.length
            for (let i = 0; i < allData.length; i++) {
                dispersia += Math.pow((allData[i] - average), 2)
            }
            dispersia = dispersia / (allData.length - 1);
            deviation = Math.sqrt(dispersia);

            let irwinCriterion = 0;
            for (let i = 0; i < allData.length; i++) {
                irwinCriterion = calcIrwinCriterion(allData[i], allData[i - 1], deviation)
                let row = []
                row.push(i)
                row.push(allData[i])
                row.push(irwinCriterion ? irwinCriterion : 0)
                if (i < 70) {
                    row.push(irwinCriterion > 1 ? 1 : 0)
                    trainingData.push(row)
                } else {
                    testingData.push(row)
                }

            }
            console.log('trainingData :>> ', trainingData);
            console.log('testingData :>> ', testingData);
            var result = svm.fit(trainingData);

            console.log(result);

            const resultData = [];

            trainingData.forEach(data => resultData.push(data))

            testingData.forEach((data, index) => {
                var predicted = svm.transform(data);
                // console.log('index: ' + index + " value: " + data[1] + " predicted: " + predicted);
                data.push(predicted)
                resultData.push(data)
            })

            const x1 = []
            const x2 = []
            const y1 = []
            const y2 = []
            const z1 = []
            const z2 = []

            testingData.forEach(data => {
                if (data[3] === 0) {
                    x1.push(data[2])
                    y1.push(data[0])
                    z1.push(data[3])
                } else {
                    x2.push(data[2])
                    y2.push(data[0])
                    z2.push(data[3])
                }
            })


            let trace1 = {
                x: x1,
                y: y1,
                z: z1,
                mode: "markers",
                marker: {
                    size: 12,
                    line: {
                        color: "rgba(217, 217, 217, 0.14)",
                        width: 0.5
                    },
                    opacity: 0.8
                },
                type: "scatter3d"
            }
            let trace2 = {
                x: x2,
                y: y2,
                z: z2,
                mode: "markers",
                marker: {
                    size: 12,
                    line: {
                        color: "green",
                        width: 0.5
                    },
                    opacity: 0.8
                },
                type: "scatter3d"
            }
            var dataMarker = [trace1, trace2];

            var layout = {margin: {
                l: 0,
                r: 0,
                b: 0,
                t: 0
              }};
            var graphOptions = {layout: layout, filename: "simple-3d-scatter", fileopt: "overwrite"};
            plotly.plot(dataMarker, graphOptions, function (err, msg) {
                res.status(200).send({resultData, msg});
            });
            
        } catch (err) {
            res.status(400).send(err);
        }
    }

    module.exports = {
        train
    };
})();
