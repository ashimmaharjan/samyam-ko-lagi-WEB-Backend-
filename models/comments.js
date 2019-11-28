const mongoose = require('mongoose');

const Comments = mongoose.model('Comments', {

    first_name: {
        type: String
    },
    phone_number: {
        type: Number
    },
    carName: {
        type: String
    },
    comment: {
        type: String
    }
})

module.exports = Comments