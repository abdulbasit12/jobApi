let mongoose = require('mongoose');

const buildingSchema = mongoose.Schema({
    buildingname: {
        type: String,
        required: true
    },
})

let Building = mongoose.model('Building', buildingSchema);
module.exports = Building;