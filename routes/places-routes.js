const express = require("express")

// import express validator package to validate if a user enters a title and description
//  the check method actually is a method or a function we can execute and it will return a new middleware
// configured for our validation requirements.
const { check } = require("express-validator")

// import controllers
const placesControllers = require("../controllers/places-controllers")

// gives us a special object on which we can register middleware, which is filtered by HTTP method
const router = express.Router();


// routes
router.get("/:pid", placesControllers.getPlaceById);

router.get("/user/:uid", placesControllers.getPlacesByUserId)

// check then takes the name of the field in your request body which you want to validate,
// in order to make sure title is not empty, we chain .isEmpty method
router.post(
    "/", [
    check("title")
        .not()
        .isEmpty(),

    check("description")
        .isLength({ min: 5 }),

    check("address")
        .not()
        .isEmpty()
],
    placesControllers.createPlace
)

// The HTTP PATCH request method applies partial modifications to a resource
// works fine if replaced with put
// need to validate title and description are not empty, with a min lenght of 5 character
router.patch("/:pid", [
    check("title")
        .not()
        .isEmpty(),
        
    check("description")
        .isLength({ min: 5 }),

],
    placesControllers.updatePlace)


router.delete("/:pid", placesControllers.deletePlace)

// export syntax in node.js
module.exports = router;