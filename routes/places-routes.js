const express = require("express")

// gives us a special object on which we can register middleware, which is filtered by HTTP method
const router = express.Router();

// will be replaced with database access
const DUMMY_PLACES = [];

// routes
router.get("/", (req, res, next) => {
    console.log("GET request in places")
    res.json({ message: "It works!" })
})

// export syntax in node.js
module.exports = router;