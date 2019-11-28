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
describe('Delete Car Schema test', () => {

    it('Delete car function testing', async () => {//For test purpose, an id of a car has been manually provided.
        const status = await Cars.deleteOne({ _id: Object('5d22f3ab7486041b0016abb5') });
        expect(status.ok).toBe(1);
    });
})