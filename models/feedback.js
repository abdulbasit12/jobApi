let mongoose = require('mongoose');

const feedbackSchema = mongoose.Schema({
    username:{
        type: String,
        required: true
    },
    feedback: {
        type: String,
        required: true
    },
})

let Feedback = mongoose.model('Feedback', feedbackSchema);
module.exports = Feedback;