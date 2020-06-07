(function () {
    "use strict";

    const server = require("../../server");
    var plotly = require('plotly')("eli.bychkova", "SifvqMMyBVJPmNQYrbhI");
    const CovidRussia = server.main.model("CovidRussia");
    var iris = require('js-datasets-iris');
    var jssvm = require('js-svm');
    var svm = new jssvm.BinarySvmClassifier();
    iris.shuffle();
    const csv = require("csvtojson");

    // const dataColumns = ['infected', 'testsCount', 'testsApplication']
    const exampleData = [{
        region: 'Москва',
        observed_date: new Date('2020-04-10T21:00:00.000Z'),
        population: 10382754,
        infected: 2,
        tests: 15
        // tourists: 15
    },
    {
        region: 'Москва',
        observed_date: new Date('2020-04-11T21:00:00.000Z'),
        population: 10382754,
        infected: 4,
        tests: 15
        // tourists: 15
    },
    {
        region: 'Москва',
        observed_date: new Date('2020-04-12T21:00:00.000Z'),
        population: 10382754,
        infected: 100,
        tests: 15
        // tourists: 15
    },
    ]
    // infected = infected by current day - infected by previous day
    // infectionCoefficient = infected/tourists
    // testsApplication = infected/tests

    // tests = 15/
    // const trainingData = [
    //     [2, 15, 0.1333, 0],
    //     [4, 16, 0.2667, 0],
    //     [100, 13, 6.6667, 1],
    //     [2, 13, 0.1538, 0],
    //     [87, 100, 0.87, 1],
    //     [95, 14, 6.7856, 1],
    // ]

    /* 
        Если 
    */

    // const testingData = [
    //     [2, 15, 0.1333, 0],
    //     [85, 99, 0.8585, 1],
    //     [100, 13, 6.6667, 1],
    //     []
    // ]


    // var trainingDataSize = Math.round(iris.rowCount * 0.9);// 135
    var trainingData = [];
    var testingData = [];


    async function train(req, res, next) {
        try {
            const cities = await csv().fromFile('data/owid-covid-data.csv');
            if (cities) {

                const tests = cities.filter(city => city.location === 'Russia');
                tests.forEach(test => {
                    const newTests = Number(test.new_tests)
                    const newCases = Number(test.new_cases)
                    let row = [];
                    row.push(newTests)
                    row.push(newCases)
                    row.push(newTests === 0 ? 0 : newCases / newTests)
                    console.log('date :>> ', test.date);
                    console.log('total_cases :>> ', test.total_cases);
                    console.log('new_cases: :>> ', test.new_cases);
                    console.log('total_tests: :>> ', test.total_tests);
                    console.log('new_tests: :>> ', test.new_tests);
                    console.log('row :>> ', row);
                })
            }

            // console.log('example :>> ', example);

            // console.log('iris :>> ', iris);
            //rowCount = 150
            // for (var i = 0; i < iris.rowCount; ++i) {
            //     var row = [];
            //     row.push(iris.data[i][0]); // sepalLength;
            //     row.push(iris.data[i][1]); // sepalWidth;
            //     row.push(iris.data[i][2]); // petalLength;
            //     row.push(iris.data[i][3]); // petalWidth;
            //     row.push(iris.data[i][4] == "Iris-virginica" ? 1.0 : 0.0); // output which is 1 if species is Iris-virginica; 0 otherwise
            //     if (i < trainingDataSize) {
            //         trainingData.push(row);
            //     } else {
            //         testingData.push(row);
            //     }
            // }
            // console.log('trainingData :>> ', trainingData);
            // console.log('testingData :>> ', testingData);

            // var result = svm.fit(trainingData);

            // console.log(result);

            // for (var i = 0; i < testingData.length; ++i) {
            //     var predicted = svm.transform(testingData[i]);
            //     console.log("actual: " + testingData[i][3] + " predicted: " + predicted);
            // }
            // const covid = await CovidRussia.find();

            // let cities = []

            // if (covid) {
            //     cities = covid.filter(city => city.region === 'Ростовская область' ||
            //         city.region === 'Москва')
            // }

            // console.log('cities :>> ', cities);
            // var x = [];

            // for (var i = 0; i < 500; i++) {
            //     x[i] = Math.random();
            // }

            // var data = [
            //     {
            //         x: x,
            //         type: "histogram"
            //     }
            // ];
            // console.log('data :>> ', data);
            // const trace = {
            //     x: [1, 2, 14, 2],
            //     type: 'histogram'
            // }
            // const data = {
            //     x: cities.map(city => city.infected),
            //     type: 'histogram'
            // }

            // console.log('test :>> ', test);
            // var data = [trace];
            // console.log('data :>> ', data);
            // var graphOptions = { filename: "basic-box-plot", fileopt: "overwrite" };
            // plotly.plot(data, graphOptions, function (err, msg) {
            //     res.status(200).send(msg);
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
