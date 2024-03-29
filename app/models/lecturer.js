var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');

var lecturerSchema = mongoose.Schema({
    firstname    : String,
    lastname     : String,
    username     : String,
    subject      : String,
    modules      : [{type: String}]
});



lecturerSchema.plugin(timestamps);
module.exports = mongoose.model('Lecturer', lecturerSchema);