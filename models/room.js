let mongoose = require('mongoose');

const roomSchema = mongoose.Schema({
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
    roomname: {
        type: String,
        required: true
    },
})

let Room = mongoose.model('Room', roomSchema);
module.exports = Room;