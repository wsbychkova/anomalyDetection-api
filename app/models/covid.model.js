let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let Covid = new Schema({
  province: String,
  country: String,
  coordinates: Object,
  observed_data: Array,
  totalValue: Number
});


module.exports = mongoose.model('Covid', Covid);
