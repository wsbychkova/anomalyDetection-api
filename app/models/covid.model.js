let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let Covid = new Schema({
  location: String,
  date: Date,
  new_cases: Number,
  total_cases: Number,
  new_tests: Number,
  total_tests: Number
});
// let Covid = new Schema({
//   province: String,
//   country: String,
//   coordinates: Object,
//   observed_data: Array,
//   totalValue: Number
// });


module.exports = mongoose.model('Covid', Covid);
