var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var authorSchema = new Schema(
    {
        first_name: {type: String, required: true, max: 100},
        family_name: {type: String, required: true, max: 100},
        date_of_birth: {type: Date},
        date_of_death: {type: Date}
    }
);

authorSchema.virtual('name').get(function() {
    var fullname = '';
    if (this.first_name && this.family_name) {
        fullname = this.family_name + ', ' + this.first_name;
    }
    if (!this.first_name || !this.family_name) {
        fullname = '';
    }
    return fullname;
});

authorSchema.virtual('lifespan').get(function() {
    return '/catalog/author/' + this._id;
});

module.exports = mongoose.model('Author', authorSchema);
