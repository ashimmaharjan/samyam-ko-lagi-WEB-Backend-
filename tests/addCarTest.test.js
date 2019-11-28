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
describe('Add car Schema test', () => {
    it('Add Car testing', () => {
        const car = {
            'carName': 'R8',
            'carMan': 'Audi',
            'carAC_Status': 'YES',
            'carSeats': '8',
            'carMileage': '10',
            'carRegistrationNo': 'B AA4531',
            'carRentalPrice': '2000',
            'carImageName': 'Ashim1234.jpeg'
        };
        return Cars.create(car)
            .then((pro_ret) => {
                expect(pro_ret.carName).toEqual('R8');
            });
    });
})