(function () {
    "use strict";

    const server = require("../../server");
    var plotly = require('plotly')("eli.bychkova", "SifvqMMyBVJPmNQYrbhI");
    var iris = require('js-datasets-iris');
    var jssvm = require('js-svm');
    var svm = new jssvm.BinarySvmClassifier();
    iris.shuffle();
    const csv = require("csvtojson");

    // const dataColumns = ['infected', 'testsCount', 'testsApplication']

    // infected = infected by current day - infected by previous day
    // infectionCoefficient = infected/tourists
    // testsApplication = infected/tests

    // var trainingData = [
    //     [4952, 0, 0, 0],
    //     [4322, 6, 0.0013882461823229986, 0],
    //     [4272, 0, 0, 0],
    //     [3231, 0, 0, 0],
    //     [0, 302, 0, 1],
    //     [0, 501, 0, 1],
    //     [ 230926, 9709, 0.04204377159782788, 0 ],
    //     [ 205302, 8926, 0.04347741376119083, 0 ],
    //     [ 225713, 9263, 0.04103884136048876, 0 ],

    // ];
    // var testingData = [
    //     [320612, 8831, 0.027544196723765797, 0],
    //     [335305, 8726, 0.026024067639909932, 0],
    //     [332581, 8855, 0.02662509283452753, 0],
    //     [0, 8984, 0, 1],
    //     [0, 8985, 0, 1]
    // ];
    var trainingData = [
        [0, 100, 0, 1],
        [0, 1000, 0, 1],
        [0, 2000, 0, 1],
        [0, 15, 0, 1],
        [333333, 20, 0.02780401685960535, 0],
        [4000, 20000, 0.02780401685960535, 1],
        [5000, 21000, 0.02780401685960535, 0],
        [5000, 20, 0.02780401685960535, 1],
    ];
    var testingData = [];

    var svm = new jssvm.BinarySvmClassifier({
        alpha: 0.01,
        iterations: 1000,
        C: 5.0,
        trace: false
    });


    const calcDiffPercent = (a, b) => {
        let percent;
        if (a < b) {
            percent = (b - a) / a * 100
        } else {
            percent = (a - b) / a * 100
        }

        return percent;
    }

    async function train(req, res, next) {
        try {
            const cities = await csv().fromFile('data/owid-covid-data.csv');
            if (cities) {
                const tests = cities.filter(city => city.location === 'Russia');
                for (let i = 70; i < tests.length; i++) {

                    const newTests = Number(tests[i].new_tests)
                    const newCases = Number(tests[i].new_cases)
                    const prevCases = Number(tests[i - 1].new_cases)
                    const casesDiffDay = calcDiffPercent(prevCases, newCases)

                    let row = [];
                    row.push(newTests)
                    row.push(newCases)
                    row.push(newTests === 0 ? 0 : newCases / newTests)

                    if ((newCases && !newTests) || (casesDiffDay && casesDiffDay > 150)) {
                        row.push(1.0)
                    } else {
                        row.push(0.0)
                    }
                    if (i === 144) {
                        row = [333333, 20, 0.02780401685960535, 1]
                    }
                    if (i < 120) {
                        trainingData.push(row)
                    } else {
                        testingData.push(row)
                    }
                }

            }

            console.log('trainingData :>> ', trainingData);
            console.log('testingData :>> ', testingData);

            var result = svm.fit(trainingData);

            // console.log(result);
            testingData.forEach(data => {
                var predicted = svm.transform(data);
                console.log("actual: " + data[3] + " predicted: " + predicted);
            })


            // const y0 = [0, 5, 7, 15, 200, 4]

            // for (let i = 1; i < y0.length-1; i++) {
            //     let percent;
            //     if (y0[i] < y0[i + 1]) {
            //         percent =(y0[i + 1] - y0[i])/y0[i] * 100
            //     } else {
            //         percent =(y0[i] - y0[i + 1])/y0[i] * 100
            //     }

            //     console.log('percent :>> ', percent);
            // }
            // const y0 = testingData.map((data) => data[0])
            // var trace1 = {
            //     y: y0,
            //     type: 'box'
            // };

            // var data = [trace1];
            // var graphOptions = { filename: "basic-box-plot", fileopt: "overwrite" };
            // plotly.plot(data, graphOptions, function (err, msg) {
            //     console.log('msg :>> ', msg);
            // });



            res.status(200).send('msg');
        } catch (err) {
            res.status(400).send(err);
        }
    }

    module.exports = {
        train
    };
})();
