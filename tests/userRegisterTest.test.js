const User = require('../models/users');
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
describe('User Schema test', () => {
    it('User Register testing', () => {
        const user = {
            'first_name': 'test',
            'middle_name': 'test',
            'last_name': 'test',
            'gender': 'male',
            'phone_number': '9876098765',
            'address': 'test',
            'dob': '1999-01-01',
            'email': 'test@test',
            'username': 'test123',
            'password': 'pass'
        };
        return User.create(user)
            .then((pro_ret) => {
                expect(pro_ret.first_name).toEqual('test');
            });
    });
})