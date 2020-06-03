var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var genre = new Schema(
    {
      name: {type: String, required: true, min: 3, max: 100}
    }
);

genre.virtual('url').get(function() {
    return '/catalog/genre' + this._id;
});

module.exports = mongoose.model('Genre', genre);
