let mongoose = require('mongoose');

const buildingSchema = mongoose.Schema({
    deptname: {
        type: String,
        required: true
    },
    buildingname: {
        type: String,
        required: true
    },
})

let Building = mongoose.model('Building', buildingSchema);
module.exports = Building;