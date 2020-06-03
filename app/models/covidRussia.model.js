let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let CovidRussia = new Schema({
    region: String,
    general_city: String,
    coordinates: Object,
    observed_date: Date,
    population: Number,
    infected: Number,
    infectedPerDay: Number,
});


module.exports = mongoose.model('CovidRussia', CovidRussia);