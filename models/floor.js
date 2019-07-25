let mongoose = require('mongoose');

const floorSchema = mongoose.Schema({
    buildingname: {
        type: String,
        required: true
    },
    floorname: {
        type: String,
        required: true
    },
    siteMap: {
        type: String,
        required: true
    }
})

let Floor = mongoose.model('Floor', floorSchema);
module.exports = Floor;