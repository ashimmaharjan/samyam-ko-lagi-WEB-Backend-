const mongoose = require('mongoose');

const Bookings = mongoose.model('Bookings', {

    userId: {
        type: String
    },
    carId: {
        type: String
    },
    first_name: {
        type: String
    },
    phone_number: {
        type: String
    },
    carName: {
        type: String
    },
    carRentalPrice: {
        type: String
    },
    pickUpLocation: {
        type: String
    },
    pickUpDate: {
        type: Date
    },
    dropOffLocation: {
        type: String
    },
    dropOffDate: {
        type: Date
    }
})

module.exports = Bookings