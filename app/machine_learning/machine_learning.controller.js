(function () {
    "use strict";

    const server = require("../../server");
    var plotly = require('plotly')("eli.bychkova", "SifvqMMyBVJPmNQYrbhI");
    const CovidRussia = server.main.model("CovidRussia");
    var iris = require('js-datasets-iris');
    var jssvm = require('js-svm');
    var svm = new jssvm.BinarySvmClassifier();
    iris.shuffle();

    const data = [
        [   ]
    ]

    var trainingDataSize = Math.round(iris.rowCount * 0.9);// 135
    var trainingData = [];
    var testingData = [];


    async function train(req, res, next) {
        try {
            console.log('iris :>> ', iris);
            //rowCount = 150
            for (var i = 0; i < iris.rowCount; ++i) {
                var row = [];
                row.push(iris.data[i][0]); // sepalLength;
                row.push(iris.data[i][1]); // sepalWidth;
                row.push(iris.data[i][2]); // petalLength;
                row.push(iris.data[i][3]); // petalWidth;
                row.push(iris.data[i][4] == "Iris-virginica" ? 1.0 : 0.0); // output which is 1 if species is Iris-virginica; 0 otherwise
                if (i < trainingDataSize) {
                    trainingData.push(row);
                } else {
                    testingData.push(row);
                }
            }
            console.log('trainingData :>> ', trainingData);
            console.log('testingData :>> ', testingData);

            var result = svm.fit(trainingData);

            console.log(result);

            for (var i = 0; i < testingData.length; ++i) {
                var predicted = svm.transform(testingData[i]);
                console.log("actual: " + testingData[i][4] + " predicted: " + predicted);
            }
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
