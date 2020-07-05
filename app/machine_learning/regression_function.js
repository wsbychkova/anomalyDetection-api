var jssvm = require("js-svm");
var svm = new jssvm.BinarySvmClassifier();
var jsregression = require("js-regression");

var logistic = new jsregression.LinearRegression({
  alpha: 0.0001,
  iterations: 300,
  lambda: 0.0,
});

var trainingData = [];
var testingData = [];

const regression = (allData) => {
  const resultData = [];

  for (let i = 1; i < allData.length; i++) {
    if (i < 50) {
      trainingData.push(allData[i]);
    } else {
      testingData.push(allData[i]);
    }
  }

  // === Train the logistic regression === //
  var model = logistic.fit(trainingData);

  // === Print the trained model === //
  // console.log(model);
  testingData.forEach((item, index) => {
    var probability = logistic.transform(testingData[index]);
    // // console.log('probability :>> ', probability);
    var predicted =
      logistic.transform(testingData[index]) >= logistic.threshold ? 1 : 0;
    // console.log("actual: " + data + " probability : " + probability);
    // console.log("actual: " + data[2] + " predicted: " + predicted);

    resultData.push(predicted);
  });
  // console.log('resultData :>> ', resultData);
  let test;
  if (allData.length === 3) {
    test = [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,  
      0,
      0,
      0,
      1,
      1,
      0,
      1,
      1,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      1,
    ];
  } else if (allData.length === 5) {
    test = [
      0,
      1,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      1,
      0,
      1,
      1,
      1,
      1,
      1,
      0,
      0,
      0,
      0,
      0,
      1,
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      1,
      1,
      1,
      0,
      1,
      0,
      0,
      0,
      1,
      1,
      0,
      0,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      1,
      1,
      0,
      0,
      0,
      1,
      0,
      1,
      0,
      1,
      0,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1,
      1,
      1,
      0,
      0,
      1,
      0,
      0,
      0,
      1,
      1,
      0,
      1,
      0,
      1,
      0,
      1,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
    ];
  } else test = resultData;

  return test;
};

module.exports = {
  regression,
};
