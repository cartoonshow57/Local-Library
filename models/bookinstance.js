var mongoose = require('mongoose');
var moment = require('moment');

var Schema = mongoose.Schema;

var bookInstanceSchema = new Schema(
    {
        book: {type: Schema.Types.ObjectId, ref: 'Book', required: true},
        imprint: {type: String, required: true},
        status: {type: String, required: true, emun: ['Available', 'Maintenence', 'Loaned', 'Reserved'], default: 'Maintenence'},
        due_back: {type: Date, default: Date.now}
    }
);

bookInstanceSchema.virtual('url').get(function() {
    return '/catalog/bookinstance/' + this._id;
});

bookInstanceSchema.virtual('due_back_formatted').get(function() {
    return moment(this.due_back).format('MMMM Do, YYYY');
});

module.exports = mongoose.model('BookInstance', bookInstanceSchema);
