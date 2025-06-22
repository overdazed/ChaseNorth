// import express
const express = require("express");
// import Order model from models folder
const Order = require("../models/Order");

const { protect } = require("../middleware/authMiddleware");

// finishilize router
const router = express.Router();


// Get all orders for the logged in user
// @route GET /api/orders/my-orders
// @desc Get logged in user's orders
// @access Private
router.get("/my-orders", protect, async (req, res) => {
    try {
        // Fetch all orders for the currently logged in user
        // the users id is available in req.user._id
        const orders = await Order.find({ user: req.user._id }).sort({
            createdAt: -1,
        }); // sort order by creation date showing the most recent orders first
        // once we have the orders, send them back to the client as json
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).send({message: "Server Error"});
    }
});

// Route where users can retrieve the full order details
// @route GET /api/orders/:id
// @desc Get order by id
// @access Private
router.get("/:id", protect, async (req, res) => {
    try {
        // Find the order in the database using the id from the router params
        const order = await Order.findById(req.params.id).populate(
            "user",
            "name email"
        );

        // check if the order exists
        if (!order) {
            // if no order is found, return a 404 status code
            return res.status(404).json({message: "Order not found"});
        } else {
            // if the order is found, return full order details
            res.json(order);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({message: "Server Error"});
    }
});

// export the router
module.exports = router;

// include the following routes in server.js

// Create a new collection "Orders" > name it "My Orders" > GET > URL:http://localhost:9000/api/orders/my-orders
// Authorisation > Bearer > Token copy from Login request
// You can see all your orders

// Create a new request "Order Details" > GET > URL:http://localhost:9000/api/orders/:id
// Authorisation > Bearer > Token copy from Login request
// Params > id > copy an _id from "My Orders" request
// You get a 200 response with the order details

// We have completed the order routes

// open .env file
