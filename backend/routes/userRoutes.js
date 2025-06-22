const express = require('express');
const User = require('../models/User');
const jwt = require("jsonwebtoken");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// @route POST /api/users/register
// @desc Register a user
// @access Public

// call the router.post method, we will not be specifying the API/users here, we will do it later in the server.js file
router.post('/register', async (req, res) => {
    // extract the name, email and password from the request body
    const { name, email, password } = req.body;
    try {
        // Registration logic
        // Test this route by displaying all the values
        // res.send({ name, email, password })
        // check if a user with the provided email address already exists (case-insensitive)
        const emailLower = email.toLowerCase();
        let user = await User.findOne({ email: { $regex: new RegExp(`^${emailLower}$`, 'i') } });

        if (user)
            // if the user already exists, return a 400 status code
            return res.status(400).json({message: "User already exists"});
        // if the user does not exist, create a new user instance with the provided details
        user = new User({ name, email: emailLower, password });
        // save the user to the database
        await user.save();

        // we want to be able to send a token along with the user details
        // we will do this by making use of the JSON Web Token (JWT)
        // Create JWT Payload, this will contain information about the user.id and role
        // payload will get embedded in the token and we will decode it for authorising the user at the backend
        const payload = {
            user: {
                id: user._id,
                role: user.role
            }
        };

        // Sign and return the token along with user data
        // jwt.sign will generate a token provided payload and a secret key for signing
        // pass the payload, secret key, we will need to create a secret key for this and save it in the .env variable
        // ensure that the key is at least 32 characters, and contains special characters, numbers and capital letters
        // specify the token validity using the expiresIn key
        // callback function (err, token) that will provide us an error or generate a token
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            {expiresIn: "1d"},
            (err, token) => {
                // if there is an error, we'll throw the error
                if (err) throw err;

                // or send the user a token in response
                // to test, enter a different email address in postman
                // later we'll look at how to make use of the token to authorise the user
                res.status(201).json({
                    user: {
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                        role: user.role
                    },
                    token,
                });
            }
        );
    } catch (error) {
        // If there is an error, we will log it
        console.log(error);
        res.status(500).send("Server Error");
    }
});

// @route POST /api/users/login
// @desc Authenticate a user
// @access Public
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email (case-insensitive)
        const emailLower = email.toLowerCase();
        let user = await User.findOne({ email: { $regex: new RegExp(`^${emailLower}$`, 'i') } });

        if (!user) return res.status(400).json({message: "Invalid credentials"});
        // We need to match the password
        const isMatch = await user.matchPassword(password); // returns a boolean value{}
        // If the password does not match, we will return a 400 status code error
        if (!isMatch) return res.status(400).json({message: "Invalid credentials"});

        // Create JWT Payload, this will contain information about the user.id and role
        const payload = {
            user: {
                id: user._id,
                role: user.role
            }
        };

        // We can use the JWT payload and sign method from the registered route
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            {expiresIn: "1d"},
            (err, token) => {
                // if there is an error, we'll throw the error
                if (err) throw err;

                // or send the user a token in response
                // to test, enter a different email address in postman
                // later we'll look at how to make use of the token to authorise the user
                res.json({
                    user: {
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                        role: user.role
                    },
                    token,
                });
            }
        );

        // Check if the password is correct
    } catch (error) {
        // log the error
        console.log(error);
        res.status(500).send("Server Error");
        // in Postman, create a new Request, name it "Login" > change to POST > URL:
    }
})

// Create a route for the user profile
// @route GET /api/users/profile
// @desc Get logged-in user's profile (Protected route)
// @access Private

// create a middleware function to protect this request, we implement it later, but this is where it will be called
router.get("/profile", protect, async (req, res) => {
    // we will respond with request.user which will be assigned by our middleware and it will contain the user object
    // req.user is getting assigned in middleware
    res.json(req.user)
})

// create folder "middleware" > file "authMiddleware.js"

module.exports = router;

// open server.js file
// declare the variable userRoutes