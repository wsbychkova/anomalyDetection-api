(function () {
  "use strict";

  var plotly = require("plotly")("eli.bychkova", "SifvqMMyBVJPmNQYrbhI");
  // const csv = require("csvtojson");
  const fs = require("fs");
  const fileContents = fs.readFileSync("./testData.json", "utf8");

  const svmFunction = require("./svm_function");
  const randomForestFunction = require("./randomForest_function");
  const regressionFunction = require("./regression_function");

  const estimation = (real, predict) => {
    let TP = 0;
    let FP = 0;
    let FN = 0;
    let TN = 0;

    if (real === 1 && predict === 1) {
      TP += 1;
    }
    if (real === 1 && predict === 0) {
      FP += 1;
    }
    if (real === 0 && predict === 1) {
      FN += 1;
    }
    if (real === 1 && predict === 1) {
      TN += 1;
    }

    const presision = TP / (TP + FP);
    const recall = TP / (TP + FN);
    let FScore = 2 / (1 / presision + 1 / recall);
    if (!FScore) {
      FScore = 0;
    }
    return FScore;
  };

  async function hybridAnomalyDetection(req, res, next) {
    try {
      const testData = [];
      const trainData = [];
      const data = JSON.parse(req.body.data);

      for (let i = 1; i < data.length; i++) {
        const last = data[i].length - 1;
        if (i < 50) {
          trainData.push(data[i][last]);
        } else {
          testData.push(data[i][last]);
        }
      }   

      const svm = svmFunction.svmTrain(data);
      const randomForest = randomForestFunction.randomForest(data);
      const regression = regressionFunction.regression(data);

      let resultOfHybridMethod = [];
      for (let i = 0; i < svm.length; i++) {
        resultOfHybridMethod.push(0);
        if (svm[i] === 1 || randomForest[i] === 1 || regression[i] === 1) {
          let x = 0;

          if (svm[i] === 1) {
            x += 1;
          } else {
            x -= 1;
          }
          if (randomForest[i] === 1) {
            x += 1;
          } else {
            x -= 1;
          }
          if (regression[i] === 1) {
            x += 1;
          } else {
            x -= 1;
          }

          const svmEstimate = estimation(testData[i], svm[i]);
          const randomForestEstimate = estimation(testData[i], randomForest[i]);
          const regressionEstimate = estimation(testData[i], regression[i]);

          const maxEstimation = Math.max(
            svmEstimate,
            randomForestEstimate,
            regressionEstimate
          );
          if (maxEstimation === 1 && x < 0) {
            resultOfHybridMethod[i] = 0;
          } else if (maxEstimation === 1 && x > 0) {
            resultOfHybridMethod[i] = 1;
          } else if (maxEstimation === 0) {
            resultOfHybridMethod[i] = 0;
          }
        }
      }

      console.log('randomForest :>> ', randomForest);

      const resultData = {
        svm: svm,
        randomForest: randomForest,
        regression: regression,
        resultOfHybridMethod: resultOfHybridMethod,
        allData: {  
          data: data,
          testData: testData,
          trainData: trainData,
        },
      };
      // console.log('resultData :>> ', resultData);
      // res.setTimeout(2000, () => res.send(resultData));
      res.status(200).send(resultData);
    } catch (err) {
      res.status(400).send(err);
    }
  }

  module.exports = {  
    hybridAnomalyDetection,
  };
})();
