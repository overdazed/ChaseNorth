// this will contain the middleware to protect routes

// import the jsonwebtoken library
const jwt = require('jsonwebtoken');

// import the User model
const User = require('../models/User');

// Middleware to protect routes
const protect = async (req, res, next) => {
    let token;

    // Check if the authorization header exists and the header starts with 'Bearer' string
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        // Assign this header with the 'Bearer' string at the front end while calling the request for the profile
        try {
            // get the second value of the authorization header
            // This is because after the 'Bearer' we will send the token along with it
            token = req.headers.authorization.split(" ")[1];
            // After we extract the token, we'll verify the token sent from the front end
            const decoded = jwt.verify(token, process.env.JWT_SECRET); // verify method will require the JWT_SECRET key from the .env file

            // to test: paste the token on this site https://jwt.io/ and check the payload

            // Now that we have the user id, we can easily get the user information and attach it to the request.user object
            // exclude the password
            req.user = await User.findById(decoded.user.id).select('-password');

            // proceed to the next middleware or other operations
            next();

        } catch (error) {
            // add the log for the error
            // display the error
            console.error("Token verification failed", error);
            res.status(401).json({message: "Not authorized, token failed"});
        }
    } else {
        res.status(401).json({message: "Not authorized, no token provided"});
    }
}

// We do not want a customer to create a product
// Add a middleware to check for the admin user before creating the product
// Middleware to check if the user is an admin
const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        // allow the operation by calling the next function
        next();
    } else {
        res.status(403).json({message: "Not authorized as an admin"});
    }
}

module.exports = { protect, admin };

// import in userRoutes

// in postman, create a new Request, name it "Profile" > change to GET > URL:http://localhost:9000/api/users/profile
// Header > Authorization > Bearer > " " > Token
// Response:
// {
//     "_id": "6849efc3b81356f9645b440d",
//     "name": "John",
//     "email": "John@example.com",
//     "role": "customer",
//     "createdAt": "2025-06-11T21:06:11.641Z",
//     "updatedAt": "2025-06-11T21:06:11.641Z",
//     "__v": 0
// }