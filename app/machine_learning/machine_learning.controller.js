(function () {
    "use strict";

    var plotly = require('plotly')("eli.bychkova", "SifvqMMyBVJPmNQYrbhI");
    var jssvm = require('js-svm');
    var svm = new jssvm.BinarySvmClassifier();
    const csv = require("csvtojson");
    const RandomForestClassifier = require('random-forest-classifier').RandomForestClassifier;

    var trainingData = [];
    var testingData = [];

    var svm = new jssvm.BinarySvmClassifier({
        alpha: 0.01,
        iterations: 1000,
        C: 5.0,
        trace: false
    });

    const calcDeviation = (data) => {
        let dispersia = 0;
        let average = data.reduce((accum, current) => accum + current);
        average = average / data.length;
        data.forEach(data => dispersia += Math.pow((data - average), 2))
        dispersia = dispersia / (data.length - 1);
        const deviation = Math.sqrt(dispersia);
        return deviation;
    }

    const calcIrwinCriterion = (current, previous, deviation) => {
        return Math.abs(current - previous) / deviation
    }

    const formatData = (filterData) => {
        const allData = []
        filterData.forEach((data, index) => {
            if (index > 72) {
                allData.push(Number(data.new_cases))
            }
            if (index === 131) allData.push(324)
            if (index === 85) allData.push(7112)
            if (index === 150) allData.push(531)
        })
        return allData;
    }

    const createPlotly = (x, y, z) => {
        let trace1 = {
            x: x.x1,
            y: y.y1,
            z: z.z1,
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
            x: x.x2,
            y: y.y2,
            z: z.z2,
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

        var layout = {
            margin: {
                l: 0,
                r: 0,
                b: 0,
                t: 0
            }
        };
        var graphOptions = { layout: layout, filename: "simple-3d-scatter", fileopt: "overwrite" };

        return ({ dataMarker, graphOptions })

    }

    async function svmTrain(req, res, next) {
        try {
            let irwinCriterion = 0;
            const data = await csv().fromFile('data/owid-covid-data.csv');
            const filterData = data.filter(city => city.location === 'Russia');
            const allData = formatData(filterData);
            const deviation = calcDeviation(allData);

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

            var result = svm.fit(trainingData);

            // console.log(result);

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

            const gettingPlot = createPlotly({ x1, x2 }, { y1, y2 }, { z1, z2 })

            plotly.plot(gettingPlot.dataMarker, gettingPlot.graphOptions, function (err, msg) {
                res.status(200).send({ resultData, msg })
            });



        } catch (err) {
            res.status(400).send(err);
        }
    }

    async function randomForestTrain(req, res, next) {
        try {
            const data = await csv().fromFile('data/owid-covid-data.csv');
            const filterData = data.filter(city => city.location === 'Russia');
            const allData = formatData(filterData)
            const deviation = calcDeviation(allData);
            allData.forEach((data, index) => {
                const irwinCriterion = calcIrwinCriterion(allData[index], allData[index - 1], deviation);
                let row = index < 70 ? (
                    {
                        infected: data,
                        irwinCriterion: irwinCriterion ? irwinCriterion : 0,
                        isAnomaly: irwinCriterion > 1 ? 1 : 0
                    }) : ({
                        infected: data,
                        irwinCriterion: irwinCriterion ? irwinCriterion : 0,
                    })

                if (index < 70) {
                    trainingData.push(row)
                } else {
                    testingData.push(row)
                }
            })

            var rf = new RandomForestClassifier({
                n_estimators: 30
            });
            const resultData = []

            rf.fit(trainingData, null, "isAnomaly", function (err, trees) {
                //console.log(JSON.stringify(trees, null, 4));
                var pred = rf.predict(testingData, trees);

                console.log(pred);
                pred.forEach((value, index) => {
                    resultData.push([testingData[index].infected, testingData[index].irwinCriterion, value])
                })
            });

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

            const gettingPlot = createPlotly({ x1, x2 }, { y1, y2 }, { z1, z2 })

            plotly.plot(gettingPlot.dataMarker, gettingPlot.graphOptions, function (err, msg) {
                res.status(200).send({ resultData, msg })
            });

        } catch (err) {
            res.status(400).send(err);
        }
    }

    async function pcaTrain(req, res, next) {
        try {
            const data = await csv().fromFile('data/owid-covid-data.csv');
            const filterData = data.filter(city => city.location === 'Russia');
            const allData = formatData(filterData)
            const deviation = calcDeviation(allData);
            allData.forEach((data, index) => {
                const irwinCriterion = calcIrwinCriterion(allData[index], allData[index - 1], deviation);
                let row = index < 70 ? (
                    {
                        infected: data,
                        irwinCriterion: irwinCriterion ? irwinCriterion : 0,
                        isAnomaly: irwinCriterion > 1 ? 1 : 0
                    }) : ({
                        infected: data,
                        irwinCriterion: irwinCriterion ? irwinCriterion : 0,
                    })

                if (index < 70) {
                    trainingData.push(row)
                } else {
                    testingData.push(row)
                }
            })

            var rf = new RandomForestClassifier({
                n_estimators: 30
            });
            const resultData = []

            rf.fit(trainingData, null, "isAnomaly", function (err, trees) {
                //console.log(JSON.stringify(trees, null, 4));
                var pred = rf.predict(testingData, trees);

                console.log(pred);
                pred.forEach((value, index) => {
                    resultData.push([testingData[index].infected, testingData[index].irwinCriterion, value])
                })
            });

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

            const gettingPlot = createPlotly({ x1, x2 }, { y1, y2 }, { z1, z2 })

            plotly.plot(gettingPlot.dataMarker, gettingPlot.graphOptions, function (err, msg) {
                res.status(200).send({ resultData, msg })
            });

        } catch (err) {
            res.status(400).send(err);
        }
    }

    module.exports = {
        svmTrain,
        randomForestTrain,
        pcaTrain
    };
})();
