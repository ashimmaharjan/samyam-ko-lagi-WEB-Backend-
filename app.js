require('./database/database');

const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

const multer = require('multer');
const path = require('path');

const User = require('./models/users');
const Car = require('./models/Cars');
const Bookings = require('./models/bookings');
const Comments = require('./models/comments');
const Auth = require('./middleware/auth');
const jwt = require('jsonwebtoken');

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("./images"));
app.use(cors());


// Registration of New Users is handled from here.

app.post('/register', (req, res) => {
    var userData = new User(req.body);
    var response = "";
    console.log("REQUEST-->" + userData);
    userData.save().then(function () {
        response = alert("Registered successfully.");
        console.log(response);
        res.send(response);

    }).catch(function (e) {
        response = "Error";
        console.log(response)
        res.send(e);
    })
})
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Login of registered users is handled from here. 

app.post('/login', async function (req, res) {

    var inputUsername = req.body.username;
    var inputPassword = req.body.password;

    const user = await User.checkCredentialsDb(inputUsername, inputPassword);

    if (user != null) {
        console.log(user);
        const token = await user.generateAuthToken();
        res.send({ token });
    }
    else {
        res.json({
            message: "Invalid! Login Denied!!"
        })
        console.log("Invalid username or password.");
    }


})
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Image of car to be added is saved into the database through this.

var storage = multer.diskStorage({
    destination: "images",
    filename: (req, file, callback) => {
        let ext = path.extname(file.originalname);
        callback(null, "Ashim" + Date.now() + ext);
    }
});

var imageFileFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb("Only image files accepted!!"), false;
    }
    cb(null, true);
};

var upload = multer({ storage: storage, fileFilter: imageFileFilter, limits: { fileSize: 1000000 } });

app.post('/uploadCarImage', upload.single('imageFile'), (req, res) => {
    res.send(req.file);
    console.log(req.file);
    console.log("Image uploaded");

})
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// The details of new car to be added is saved through it.

app.post('/addCar', (req, res) => {

    console.log("Inside API");
    var response = "Nothing";

    var carName = req.body.carName;
    var carMan = req.body.carMan;
    var carImageName = req.body.carImageName;
    var carAC = req.body.carAC_Status;
    var carSeats = req.body.carSeats;
    var carMileage = req.body.carMileage;
    var carRegNo = req.body.carRegistrationNo;
    var carRprice = req.body.carRentalPrice;

    var carData = new Car(
        {
            'carName': carName,
            'carMan': carMan,
            'carImageName': carImageName,
            'carAC_Status': carAC,
            'carSeats': carSeats,
            'carMileage': carMileage,
            'carRegistrationNo': carRegNo,
            'carRentalPrice': carRprice
        }
    );
    console.log("REQUEST-->" + carData);
    carData.save().then(function () {
        response = "Car added successfully"
        console.log(response);
        res.send(response);
    }).catch(function (e) {
        response = "Error"
        console.log(response);
        res.send(e);
    })

})
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// The data of added cars is retrieved throuh this

app.get('/getCars', function (req, res) {
    Car.find().then(function (cars) {
        res.send(cars);
        console.log(cars);
    }).catch(function (e) {
        res.send(e)
    })
})
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// The data of all users is retrieved through this

app.get('/getUsers', function (req, res) {
    User.find().then(function (users) {
        res.send(users);
        console.log(users);
    }).catch(function (e) {
        res.send(e)
    })
})
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// The fillowing code handles the deletion of selected user

app.delete('/deleteUser/:id', function (req, res) {
    User.findByIdAndDelete(req.params.id).then(function () {

        console.log("User deleted successfully.");
        res.status(201).json({
            message: "User deleted"
        });
    }).catch(function () {

    })
})
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



// The following code handles the deletion of selected car

app.delete('/deleteCar/:id', function (req, res) {
    Car.findByIdAndDelete(req.params.id).then(function () {
        console.log("Car deleted successfully.");
        res.status(201).json({
            message: "Car deleted"
        });
    }).catch(function () {

    })
})
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



// The data of selected car is retrieved with the following code

app.get('/getSpecificCar/:id', function (req, res) {
    uid = req.params.id.toString();
    Car.findById(uid).then(function (car) {
        res.send(car);
    }).catch(function (e) {
        res.send(e)
    });
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// The data of existing specific car is updated with this code

app.put('/updateCar/:id', function (req, res) {
    uid = req.params.id.toString();
    console.log(uid);
    console.log(req.body);
    Car.findByIdAndUpdate({ _id: uid }, req.body).then(function () {
        console.log("Car updated successfully.")
        res.send();
    }).catch(function (e) {

    })
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



// The data of logged in user is retrieved through this

app.get('/getSpecificUser', Auth, function (req, res) {
    res.send(req.user);
    console.log(req.user);
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// The following code handles updating the profile information of logged in user

app.put('/updateProfile', Auth, function (req, res) {
    uid = req.user._id;
    console.log(uid);
    console.log(req.body);
    User.findByIdAndUpdate(uid, req.body, { new: true }).then(function (user) {
        res.send(user);
        console.log("Profile updated successfully.");
    }).catch(function (e) {

        res.send(e);
    })
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Logout action is handled by the following code

app.post('/logout', Auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send();
    } catch (e) {
        res.status(500).send();
    }
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



// Booking of a car is handled by the following code

app.post('/bookCar', (req, res) => {

    console.log("Inside API");
    var response = "Nothing";
    var uid = req.body.userId;
    var cid = req.body.carId;
    var fName = req.body.first_name;
    var PN = req.body.phone_number;
    var carName = req.body.carName;
    var carRprice = req.body.carRentalPrice;
    var PL = req.body.pickUpLocation;
    var PD = req.body.pickUpDate;
    var DL = req.body.dropOffLocation;
    var DD = req.body.dropOffDate;

    console.log(uid);
    console.log(cid);
    var bookDetails = new Bookings(
        {
            'userId': uid,
            'carId': cid,
            'first_name': fName,
            'phone_number': PN,
            'carName': carName,
            'carRentalPrice': carRprice,
            'pickUpLocation': PL,
            'pickUpDate': PD,
            'dropOffLocation': DL,
            'dropOffDate': DD
        });
    console.log("REQUEST-->" + bookDetails);
    bookDetails.save().then(function () {
        response = "Car booked successfully"
        console.log(response);
        res.send(response);
    }).catch(function (e) {
        response = "Error"
        console.log(response);
        res.send(e);
    })
})
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



// The data of all the bookings made by the users is retrieved by the code below

app.get('/getBookings', function (req, res) {
    Bookings.find().then(function (bookings) {
        res.send(bookings);
        console.log(bookings);
    }).catch(function (e) {
        res.send(e)
    })
})
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Deletion of a specific booking data is handled by this

app.delete('/deleteBookings/:id', function (req, res) {
    Bookings.findByIdAndDelete(req.params.id).then(function () {
        console.log("Booking data deleted successfully.");
        res.status(201).json({
            message: "Booking data deleted"
        });
    }).catch(function () {

    })
})
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Commenting on a car is handled by this code

app.post('/commentCar', (req, res) => {

    console.log("Inside API");
    var response = "Nothing";

    var fName = req.body.first_name;
    var PN = req.body.phone_number;
    var carName = req.body.carName;
    var comment = req.body.comment;

    var comment = new Comments(
        {
            'first_name': fName,
            'phone_number': PN,
            'carName': carName,
            'comment': comment
        });
    console.log("REQUEST-->" + comment);
    comment.save().then(function () {
        response = "Comment on car added successfully"
        console.log(response);
        res.send(response);
    }).catch(function (e) {
        response = "Error"
        console.log(response);
        res.send(e);
    })
})
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Data regarding the comments made by the users on cars is retrived through this

app.get('/getComments', function (req, res) {
    Comments.find().then(function (comment) {
        res.send(comment);
        console.log(comment);
    }).catch(function (e) {
        res.send(e)
    })
})
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Deletion of a comment is handled by this code

app.delete('/deleteComment/:id', function (req, res) {
    Comments.findByIdAndDelete(req.params.id).then(function () {
        console.log("Comment deleted successfully.");
        res.status(201).json({
            message: "Booking data deleted"
        });
    }).catch(function () {

    })
})
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// The following code retrieves data of bookings made by specific user

app.get('/bookingDetails/:id', (req, res) => {

    uid = req.params.id.toString();
    console.log("booking details Item kicking ............................... with userid" + uid)
    console.log(uid);
    Bookings.find({ userId: uid }).then(function (cartData) {
        res.json(cartData);
        console.log(" values " + cartData);
    }).catch(function (e) {
        res.send(e)
    });

})
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.listen(1212);
