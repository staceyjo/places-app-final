const express = require("express")

// import controllers
const usersControllers = require("../controllers/users-controller")

// gives us a special object on which we can register middleware, which is filtered by HTTP method
const router = express.Router();


// routes
router.get("/", usersControllers.getUsers);


router.post("/signup", usersControllers.signup)


router.post("/login", usersControllers.login)



// export syntax in node.js
module.exports = router;