(function () {
    "use strict";
    const server = require("../../server");
    const moment = require("moment");
    const Covid = server.main.model("Covid");


    // Y = a+bx,
    // где х - это день (date) (зависимая)
    // y - это количество инфицировнных (value) (независимая)
    // a и b — коэффициенты регрессии оцененной линии

    function getCoeff_B(y_arr) {
        const n = 10;
        // const n = y_arr.length;
        let coeff_B = 0;
        let sumXlnY = 0;
        let sumX = 0;
        let sumlnY = 0;
        let squareX = 0;

        y_arr.forEach((y, x) => {
            if (x < 10) {
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
        // const n = y_arr.length;
        const n = 10;
        let coeff_A = 0;
        let sumlnY = 0;
        let sumX = 0;

        y_arr.forEach((y, x) => {
            if (x < 10) {
                sumlnY += Math.log(y);
                sumX += x;
            }

        })

        coeff_A = ((1 / n) * sumlnY) - (coeff_B / n * sumX)
        return coeff_A;
    }


    async function getRegression(req, res, next) {
        try {

            const x_arr = [];
            const y_arr = []
            const covid = await Covid.find();
            const city = covid.filter(city => city.province === 'Hubei')
            if (city) {
                city[0].observed_data.map((value, index) => {
                    x_arr.push(index)
                    y_arr.push(value.value)
                })
            }
            // console.log('x_arr :', x_arr);
            // console.log('y_arr :', y_arr);
            // Вычислим коэффициенты уравнения экспоненциальной регрессии
            const coeff_B = getCoeff_B(y_arr)
            const coeff_A = getCoeff_A(y_arr, coeff_B)

            const regression = y_arr.map((y, x) => {
                   const exp = Math.exp(coeff_A + coeff_B * x)
                   return exp
            })

            res.status(200).send(regression);
        } catch (err) {
            res.status(400).send(err);
        }
    }

    module.exports = {
        getRegression
    };
})();
