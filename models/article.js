let mongoose = require('mongoose');

//Article schema
let articleSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    }
});
let Article = mongoose.model('Article', articleSchema);
module.exports = Article