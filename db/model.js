const mongoose = require('mongoose')

const servant_schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    admin: {
        type: Boolean,
        default: false,
    },
    clever: {
        type: Boolean,
        default: false,
    }
})

const servantCon = mongoose.model('user', servant_schema)

module.exports = servantCon
