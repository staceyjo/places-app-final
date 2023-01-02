require('dotenv').config();
const url = process.env.MONGO_URI;

// import packages/dependencies
const express = require("express");

// middleware ensures we parse the body of incoming requests
const bodyParser = require("body-parser");

// import mongoose to use MongoDB database
const mongoose = require("mongoose");

// Global configuration
const mongoURI = process.env.MONGO_URI;
const db = mongoose.connection;

const PORT = 5000;

// middleware
const placesRoutes = require("./routes/places-routes")
const usersRoutes = require("./routes/users-routes")

//import Http error handler
const HttpError = require("./models/http-error")


const app = express();


// register middleware- middlewares read top to bottom, so first parse the body then reach the routes
app.use(bodyParser.json())

// middleware for cors error to add headers to the response
// so when a response is sent back from more specific routes,
// the headers are attached with .setHeader()
// to set a header on the response
// we'll need 3 headers arguments for this to work:
// 1- "Access-Control-Allow-Origin", "*"
// the value * which basically allows us to control which domains have access
// we could set it to local host 3001- but it is okay here to open it up to any domain
// POSTMAN didn't care about headers...clearly
// we need to specify which headers the requests 
// by the broswer may have
// 2- "Access-Control-Allow-Headers", "*"
// insetad of *, which would work, we can be more specific
// and set "Origin, X-Requested-With, Content-Type, Accept, Authorization"
// 3- "Access-Control-Allow-Methods", ""
// which conttrols which http methods may be used on the frontend

// then call next to let the request continue the journey through middleware
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    )
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE" )
    next();
})

app.use("/api/places", placesRoutes); // => /api/places/...
app.use("/api/users", usersRoutes); // => /api/places/...


// if we send a request to a route that doesn't exist we get an error
// so we'll register a new middleware that will only run if we have a request that doesn't get a response
app.use((req, res, next) => {
    const error = new HttpError("Could not find this route.", 404);
    //could also call next(error), but this is synchronous so nothing speaks against it
    throw error;
})

// middleware using default error handler,
// this function will only be executed on requests that have an error attached to it
app.use((error, req, res, next) => {
    // check if a response has already been sent
    if (res.headerSent) {
        // return next and forward the error
        return next(error);
    }
    // if no response has been sent, set a status code on that response
    // so we are checking if on the error object, we have a code property
    // if we don't have it- we'll fall back to 500 as a default status code
    res.status(error.code || 500)
    // adding a message property, check if there is a message on the error
    res.json({ message: error.message || "An unknown error occured!" });
})

// establish connection with mongoose

// Connect to Mongo
// mongoose.connect(mongoURI);
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

// .connect() returns a promise as the connection to the server, as an asynchronoous task
// which means we can make use of the then and catch method
// can't use this method at the moment

// mongoose
//     .connect()
//     .then(() => {
//         // calling app to listen on port
//         app.listen(5000)
//         console.log("Connected to MongoDB")

//     })
//     .catch(error => {
//         console.log(error)
//     })

// Connection Error/Success
// Define callback functions for various events
db.on("error", (err) => console.log(err.message + " is mongod not running?"));
db.on("open", () => console.log("mongo connected: to mongoURI"));
db.on("close", () => console.log("mongo disconnected"));

app.listen(PORT, function (err) {
    if (err) console.log("Error in server setup")
    console.log("Server listening on Port", PORT);
})
