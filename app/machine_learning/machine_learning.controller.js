(function () {
    "use strict";

    const server = require("../../server");
    var plotly = require('plotly')("eli.bychkova", "SifvqMMyBVJPmNQYrbhI");
    var iris = require('js-datasets-iris');
    var jssvm = require('js-svm');
    var svm = new jssvm.BinarySvmClassifier();
    iris.shuffle();
    const csv = require("csvtojson");
    const data = require('../constants')


    // const dataColumns = ['infected', 'testsCount', 'testsApplication']

    // infected = infected by current day - infected by previous day
    // infectionCoefficient = infected/tourists
    // testsApplication = infected/tests


    var trainingData = [

    ];
    var testingData = [

    ];

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
            const cities = await csv().fromFile('data/owid-covid-data.csv');
            const tests = cities.filter(city => city.location === 'Russia');
            data.regressionData.forEach(data => {
                trainingData.push([data, 0])
            })
            for (let i = 72; i < tests.length; i++) {
                //     const newTests = Number(tests[i].new_tests)
                const newCases = Number(tests[i].new_cases)

                let row = [];
                //     row.push(newTests)
                row.push(newCases)
                testingData.push(newCases)

                // if (i < 120) {
                //     trainingData.push(row)
                // } else {
                //     testingData.push(row)
                // }
                //     // row.push(newTests === 0 ? 0 : newCases / newTests)
                //     row.push(casesDiffDay ? casesDiffDay : 0)

                //     if (
                //         (newCases && !newTests)
                //         || (newCases > newTests)
                //         || (casesDiffDay > 8)
                //     ) {
                //         row.push(1.0)
                //     } else {
                //         row.push(0.0)
                //     }

                // if (i < 120) {
                //     // trainingData.push(row)
                // } else {
                //     // testingData.push(row)
                // }
                // }

            }

            // console.log('trainingData :>> ', trainingData);
            console.log('testingData :>> ', testingData);

            var result = svm.fit(trainingData);

            console.log(result);
            // console.log('testingData :>> ', testingData.length);
            testingData.forEach((data, index) => {
                var predicted = svm.transform(data);
                // console.log("actual: " + data[0] + " predicted: " + predicted);
            })

            const test =testingData
            let average = 0;
            let dispersia = 0;
            let deviation = 0;

            for (let i = 0; i < test.length; i++) {
                average += test[i]
                dispersia += Math.pow((test[i] - 24.3), 2)
            }
            average = average / test.length
            dispersia = dispersia / (test.length - 1);
            deviation = Math.sqrt(dispersia)

            for (let i = 0; i < test.length; i++) {
                const irwinCriterion = calcIrwinCriterion(test[i], test[i - 1], deviation)
                console.log('irwinCriterion :>> ', irwinCriterion);
            }


            res.status(200).send('msg');
        } catch (err) {
            res.status(400).send(err);
        }
    }

    module.exports = {
        train
    };
})();
