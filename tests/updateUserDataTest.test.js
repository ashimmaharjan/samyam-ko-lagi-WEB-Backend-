const Users = require('../models/users');
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
describe('Update User Schema test', () => {

    it('Update User function testing', async () => {
        return Users.findOneAndUpdate({ _id: Object('5cfb3d206efdf51dc0e36ce0') }, //For test purpose, an id of a car has been manually provided.

            { $set: { middle_name: 'Kumar' } })
            .then((userData) => {
                expect(userData.middle_name).toEqual('Kumar')
            })
    });
})