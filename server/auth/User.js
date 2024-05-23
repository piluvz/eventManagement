const mongoose = require('mongoose');
// const { boolean } = require('webidl-conversions');
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
    email: String,
    full_name: String,
    password: String,
    isAdmin: Boolean,
    myEvents: [{type: Schema.Types.ObjectId, ref: 'event'}]
})

module.exports = mongoose.model('user', userSchema);