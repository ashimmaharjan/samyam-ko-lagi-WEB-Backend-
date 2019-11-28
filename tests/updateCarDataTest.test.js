const Cars = require('../models/Cars');
const mongoose = require('mongoose');
const url = 'mongodb://localhost:27017/CarRentals';
beforeAll(async () => {
    await mongoose.connect(url, {
        useNewUrlParser: true,
        useCreateIndex: true
    });
});
afterAll(async () => {
    await mongoose.connection.close();
});
describe('Update Car Schema test', () => {

    it('Update car function testing', async () => {
        return Cars.findOneAndUpdate({ _id: Object('5d22f3ab7486041b0016abb5') }, //For test purpose, an id of a car has been manually provided.

            { $set: { carName: 'Audi R8' } })
            .then((carData) => {
                expect(carData.carName).toEqual('Audi R8')
            })
    });
})