let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let Covid = new Schema({
  province: String,
  country: String,
  coordinates: Object,
  observed_data: Array
});


module.exports = mongoose.model('Covid', Covid);
