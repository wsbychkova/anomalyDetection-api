var jssvm = require("js-svm");

var svm = new jssvm.BinarySvmClassifier({
  alpha: 0.01,
  iterations: 1000,
  C: 5.0,
  trace: false,
});

var trainingData = [];
var testingData = [];

const svmTrain =  (allData) => {
  const resultData = [];
  for (let i = 1; i < allData.length; i++) {
    if (i < 50) {
      trainingData.push(allData[i]);
    } else {
      testingData.push(allData[i]);
    }
  }

  var result = svm.fit(trainingData);

  testingData.forEach((data, index) => {
    var predicted = svm.transform(data);
    // console.log(" value: " + data[1] + " irwin: " + data[2] + " predicted: " + predicted + ' real: ' + data[3]);

    resultData.push(predicted);
  });
  return resultData;
};

module.exports = {
  svmTrain,
};
