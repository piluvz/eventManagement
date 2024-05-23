const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const EventSchema = new mongoose.Schema({
    title: String,
    date: String,
    time: String,
    place: String,
    address: String,
    category: {type: Schema.Types.ObjectId, ref: 'category'},
    image: String,
    author: {type: Schema.Types.ObjectId, ref: 'user'},
    capacity: Number,
    availableSeats: Number,
})

module.exports = mongoose.model('event', EventSchema)