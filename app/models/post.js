// app/models/user.js
// load the things we need
var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');

var postSchema = mongoose.Schema({

    local            : {
        rating       : Number,
        comment      : String,
        lecturer     : {type: Schema.Types.ObjectId, ref: 'Lecturer'}
    }
});

postSchema.plugin(timestamps);
module.exports = mongoose.model('Post', postSchema);

