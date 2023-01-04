require('dotenv').config();

// fs allows us to interact with files in the file system
// import fs module to delete image  from disk storage if there's an error

const fs = require("fs")

// Node.js path module required for express static middleware
const path = require("path")

// import packages/dependencies
const express = require("express");

// middleware ensures we parse the body of incoming requests
const bodyParser = require("body-parser");

// import mongoose to use MongoDB database
const mongoose = require("mongoose");

// Global configuration
// const url = process.env.MONGO_URI;
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
// middleware the parse the JSON data of the app
app.use(bodyParser.json())


// despite having the correct url, getting an GET error & the image still won't show up
// this is because with the way Node.js/Express works
// by default, none of the files on the server side
// are accessible from outside the server
// which prevents outsiders from looking into the source code
// if they just typed in something like:                            
// http://localhost:5000/uploads/images/4335bd0d-fe19-42a5-b3d1-4cdfa7bf8ca2.jpeg 
// everything incoming request has to journey through the middleware
// only the logic in the middlewares executes the requests
// right now, we don't have a middleware to process a random image link request
// to grant access to images, we need a new middleware to filter
// from the /uploads/images
// special requests are handled by a speci middleware built into express
// express static
// you can execute express static as a method and it will return a middleware
// its a middleware that just returns the requested file
// static serving just means it returns a file
// to control which files and which folder we want to return
// so we point to the folder with a path
// use node path module, and join two segments- uploads and image
// this will build a new path pointing at the uploads images folder
// so now any file in there, when we request it should be returned

app.use("/uploads/images", express.static(path.join("uploads", "images")) )





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
    
    // can check if there is a file and if there is we roll back because there is an error
    // multer adds as a NEW property to the request object the file property
    // so we can check if the file is set
    if(req.file) {

        // and if it is set we know there is a file as part of the request
        // so the request where something failed made the file
        // this is the file we want to delete on the disk storage
        // to delete we have to import a core node module, fs or file system
        // .unlink is kind of like delete- it will unlink the file from
        // disk storage so it won't be added(which is like deleting it)
        // to find the file we want to delete, we use request file path
        // path is a property that exists on the file object that multer adds on the request
        // with using unlink, have to provide a callback function which 
        // will be triggered when the deletion is done
        // if something goes wrong, we call an error
        // we can just log the error- if the file deletion happens
        // we can can always manually delete it from the uploads/images folder
        // but it doesn't really matter

        fs.unlink(req.file.path, (error) => {
            console.log(error)
        })


    }



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
