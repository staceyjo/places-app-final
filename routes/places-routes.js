const express = require("express")

// import controllers
const placesControllers = require("../controllers/places-controllers")

// gives us a special object on which we can register middleware, which is filtered by HTTP method
const router = express.Router();


// routes
router.get("/:pid", placesControllers.getPlaceById);

router.get("/user/:uid", placesControllers.getPlacesByUserId)

router.post("/", placesControllers.createPlace)

// The HTTP PATCH request method applies partial modifications to a resource
// will it crash if i replace patch with put?
router.patch("/:pid", placesControllers.updatePlace)


router.delete("/:pid", placesControllers.deletePlace)

// export syntax in node.js
module.exports = router;