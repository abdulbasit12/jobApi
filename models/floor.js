let mongoose = require('mongoose');

const floorSchema = mongoose.Schema({
    deptname: {
        type: String,
        required: true
    },
    buildingname: {
        type: String,
        required: true
    },
    floorname: {
        type: String,
        required: true
    },
})

let Floor = mongoose.model('Floor', floorSchema);
module.exports = Floor;