const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    first_name: {
        type: String
    },
    middle_name: {
        type: String
    },
    last_name: {
        type: String
    },
    gender: {
        type: String
    },
    phone_number: {
        type: Number
    },
    address: {
        type: String
    },
    dob: {
        type: Date
    },
    email: {
        type: String
    },
    username: {
        type: String
    },
    password: {
        type: String
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

userSchema.statics.checkCredentialsDb = async (username, password) => {
    const user1 = await User.findOne({ username: username, password: password })
    return user1;
}

userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, "thisismynewcourse");

    console.log("Login Successful");
    console.log(token);
    user.tokens = user.tokens.concat({ token: token });
    await user.save();

    return token;
}

const User = mongoose.model('User', userSchema);

module.exports = User