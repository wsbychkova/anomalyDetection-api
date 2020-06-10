(function () {
    "use strict";
    const server = require("../../server");
    const Covid = server.main.model("Covid");
    const csv = require("csvtojson");
    // Y = a+bx,
    // где х - это день (date) (зависимая)
    // y - это количество инфицировнных (value) (независимая)
    // a и b — коэффициенты регрессии оцененной линии

    function getCoeff_B(y_arr) {
        const n = 53;
        let coeff_B = 0;
        let sumXlnY = 0;
        let sumX = 0;
        let sumlnY = 0;
        let squareX = 0;

        y_arr.forEach((y, x) => {
            y === 0 ? y = 1 : y
            if (x < n) {
                sumXlnY += x * Math.log(y);
                sumX += x;
                sumlnY += Math.log(y)
                squareX += Math.pow(x, 2)
            }
        })

        coeff_B = ((n * sumXlnY) - (sumX * sumlnY)) / ((n * squareX) - Math.pow(sumX, 2))
        return coeff_B;
    }

    function getCoeff_A(y_arr, coeff_B) {
        const n = 53;
        let coeff_A = 0;
        let sumlnY = 0;
        let sumX = 0;

        y_arr.forEach((y, x) => {
            y === 0 ? y = 1 : y
            if (x < n) {
                sumlnY += Math.log(y);
                sumX += x;
            }
        })

        coeff_A = ((1 / n) * sumlnY) - (coeff_B / n * sumX)
        return coeff_A;
    }

    function getEstimation(y_arr, coeff_B, coeff_A) {
        const n = 53
        let middleY = 0;
        let correlationIndex = 0;
        let sumYExp = 0
        let sumYEps = 0
        let approxModule = 0
        let averageApproxError = 0
        let f_criterion = 0
        y_arr.forEach((y, index) => {
            y === 0 ? y = 1 : y
            if (index < n) {
                middleY += y
            }
        })
        middleY = middleY / n;

        let eps = 0;
        y_arr.forEach((y, x) => {
            y === 0 ? y = 1 : y
            if (x < n) {
                const exp = Math.exp(coeff_A + coeff_B * x)

                eps = Math.pow((y - middleY), 2)

                sumYExp += Math.pow((y - exp), 2)
                sumYEps += eps
                approxModule += Math.abs((y - exp) / y)
            }
        })

        correlationIndex = Math.sqrt(1 - (sumYExp / sumYEps))
        averageApproxError = (1 / n) * approxModule * 100;

        const k1 = 1;
        const k2 = 13;
        f_criterion = (Math.pow(correlationIndex, 2) / (1 - Math.pow(correlationIndex, 2))) * (k2 / k1)
    }


    async function getRegression(req, res, next) {
        try {
            const y_arr = []
            const data = await csv().fromFile('data/owid-covid-data.csv');
            const cities = data.filter(city => city.location === 'Russia');
            if (cities) {
                cities.forEach((city, index) => {
                    if (index > 72 && index < 125) {
                        y_arr.push(Number(city.new_cases))
                    }
                })
            }
            // Вычислим коэффициенты уравнения экспоненциальной регрессии

            const coeff_B = getCoeff_B(y_arr)
            const coeff_A = getCoeff_A(y_arr, coeff_B)
            console.log('coeff_B :>> ', coeff_B);
            console.log('coeff_A :>> ', coeff_A);

            // const arr = [];

            // for (let i = 1; i < 53; i++) {
            //     arr.push(i)
            // }
            // console.log('arr :>> ', arr);

            const regression = y_arr.map((y, x) => {
                const exp = Math.exp(coeff_A + coeff_B * x)
                return exp
            })

            getEstimation(y_arr, coeff_B, coeff_A)
            res.status(200).send(regression);
        } catch (err) {
            res.status(400).send(err);
        }
    }

    module.exports = {
        getRegression,
        getEstimation
    };
})();
