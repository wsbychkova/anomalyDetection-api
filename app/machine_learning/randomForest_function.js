const RandomForestClassifier = require("random-forest-classifier")
  .RandomForestClassifier;

var trainingData = [];
var testingData = [];

const randomForest = (allData) => {
  const resultData = [];
  const estimation = [];
  let propertyCount = (allData[0].length - 1).toString();

  allData.forEach((data, index) => {
    let row = {};
    data.forEach((item, index) => {
      row[index] = item;
    });
    if (index < 50) {
      trainingData.push(row);
    } else {
      testingData.push(row);
    }
  });
  // console.log('trainingData :>> ', trainingData);
  // console.log('testingData :>> ', testingData);

  var rf = new RandomForestClassifier({
    n_estimators: 100,
  });

  rf.fit(trainingData, null, propertyCount, function (err, trees) {
    //console.log(JSON.stringify(trees, null, 4));
    var pred = rf.predict(testingData, trees);
    console.log("object :>> ", pred);
    // console.log(pred);
    pred.forEach((value, index) => {
      // resultData.push([testingData[index].infected, testingData[index].irwinCriterion, value])
      resultData.push(value);
    });

    const real = testingData.map((data) => data.isAnomaly);
    estimation.push(pred, real);
  });

  return resultData;
};

module.exports = {
  randomForest,
};
