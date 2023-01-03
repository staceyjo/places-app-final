const express = require("express")

// needs validaton for signup route
// import express validator package to validate if a user enters a title and description
//  the check method actually is a method or a function we can execute and it will return a new middleware
// configured for our validation requirements.
const { check } = require("express-validator")


// import controllers
const usersControllers = require("../controllers/users-controller")

// import custom multer middleware
const fileUpload = require("../middleware/file-upload")


// gives us a special object on which we can register middleware, which is filtered by HTTP method
const router = express.Router();


// routes
router.get("/", usersControllers.getUsers);


// using express validator to check name of user to ensure it is not empty
router.post(
    "/signup",
    // multer middleware being called with .single
    // "image" is the specified name expected in the
    // of the incoming request that will hold the image
    // or the file that shpuld be extracted
    // then we can configure the file that's extracted
    // in the file-upload.js middleware
    fileUpload.single("image"),
    [
        check("name")
            .not()
            .isEmpty(),

        // the normalize email method makes sure Test@test.com is converted to test@test.com
        // the .isEmail method validates if it is a valid email after it is normalized
        check("email")
            .normalizeEmail()
            .isEmail(),

        // check if password min length requirement of 6 characters  is met
        check("password")
            .isLength({ min: 6 })
    ],
    usersControllers.signup)


router.post("/login", usersControllers.login)



// export syntax in node.js
module.exports = router;