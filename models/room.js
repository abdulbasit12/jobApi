let mongoose = require('mongoose');

const roomSchema = mongoose.Schema({
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