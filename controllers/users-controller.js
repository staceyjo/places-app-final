// used npm i -- save uuid package to create unique user ids
// import { v4 as uuidv4 } from 'uuid';
const { v4: uuidv4 } = require('uuid');


// using validator to prevent user from entering place with missing info
const { validationResult } = require("express-validator")


// import http-error class by requiring it from models folder
const HttpError = require("../models/http-error")

// import user model
const User = require("../models/user")


// for postman testing
const DUMMY_USERS = [
    {
        id: "u1",
        name: "Stacey Joseph",
        email: "test@test.com",
        password: "testers"
    }

];



// middleware functions
// // ==================================== GETUSERS- for intial testing ====================================

// sends a request that returns all users stored in the database
// const getUsers = (req, res, next) => {

//     // return the array of users
//     // send back a response
//     res.json({ users: DUMMY_USERS })
// };

// // ==================================== GETUSERS- FINAL ====================================

// sends a request that returns all users stored in the database- only find email and name
const getUsers = async (req, res, next) => {

    let users;


    try {
        // return the array of users, without the password
        users = await User.find({}, "-password") // can also replace -password with "email name"
    } catch (error) {
        error = new HttpError(
            "Fetching users failed, please try again later.",
            500
        )
        return next(error)
    }
    // send back a response
    // using .map() because .find() returns an array
    // then we can turn the user into a default JS array 
    // by using .toObject
    // then set getters to true to remove the underscore
    res.json({ users: users.map(user => user.toObject({ getters: true })) })
};



// // ==================================== SIGNUP- for intial testing ====================================
// const signup = (req, res, next) => {
//     // in the middleware functions that are triggered by the routes that 
//     // have validation--calling validationResult will check
//     // if any validation errors are detected
//     const errors = validationResult(req);

//     // the validationResult has a method .isEmpty, we'll thow an error
//     if (!errors.isEmpty()) {
//         //the errors object has more data
//         console.log(errors)
//         throw new HttpError("Invalid inputs passed, please check your data.", 422)
//     }


//     // create a new user by extracting data(name, email, password) from incoming request body
//     const { name, email, password } = req.body;


//     // want to be sure we aren't able to create a new user with the same email
//     const hasUser = DUMMY_USERS.find(u => u.email === email)


//     // if that is true and we found a user that exists
//     // we want to throw an Http error with a status code of 422
//     // 422 is typically used for invalid user input
//     if (hasUser) {
//         throw new HttpError("Could not create user, email address already exists", 422);

//     }


//     // create the new user
//     const createdUser = {
//         id: uuidv4(),
//         name, // name: name
//         email,
//         password
//     }

//     // add new user to DUMMY USERS array. unshift would work if you want to push new element to start of array
//     DUMMY_USERS.push(createdUser)


//     // send back a response, 201 since we are creating new data
//     res.status(201).json({ user: createdUser })
// };

// ==================================== SIGNUP- FINAL ====================================
const signup = async (req, res, next) => {
    // in the middleware functions that are triggered by the routes that 
    // have validation--calling validationResult will check
    // if any validation errors are detected
    const errors = validationResult(req);

    // the validationResult has a method .isEmpty, we'll thow an error
    if (!errors.isEmpty()) {
        //the errors object has more data
        console.log(errors)
        return next(new HttpError(
            "Invalid inputs passed, please check your data.",
            422
        )
        )
    }


    // create a new user by extracting data(name, email, password) from incoming request body
    const { name, email, password } = req.body;


    // even though we added calidation already with the unique validator package
    // the default validation error message that comes if an email
    // exists is a techncial error message
    // so in order to have a better user experience, we can add manual validation
    // logic 
    // we can check whether an email exists by using the findOne() method
    // this will be asynchronous task so we wrap the entire thing in a try catch

    let existingUser;
    try {
        existingUser = await User.findOne({ email: email })
    } catch (error) {
        error = new HttpError(
            "Signing up failed, please try again later.",
            500
        )
        return next(error)
    }

    // if the user exists
    if (existingUser) {
        const error = new HttpError(
            "User exists already, please login instead",
            422
        )
        return next(error)
    }


    // create the new user
    // will encrypt pw later in authentication
    const createdUser = new User({
        name,
        email,
        image: "https://images.pexels.com/photos/4171757/pexels-photo-4171757.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        password,
        places: []
    })

    // now we need to save the data
    // .save() is a method in mongoose and will handle all the 
    // Mongodb code to store a new document in the database collection
    // .save will also create the unique places id
    // .save is also a promise, so we can have an async task

    try {
        await createdUser.save()

    } catch (error) {
        error = new HttpError(
            "Signing up failed, please try again",
            500
        )
        return next(error)
    }

    // send back a response, 201 since we are creating new data
    // convert mongoose object : cfreated user to a default JS object
    // then set getters to true to remove the underscore
    // in front of the ID property to make it easier to access later
    // what we get back in response also inclides a password
    // will fix this in auth stage
    res.status(201).json({ user: createdUser.toObject({ getters: true }) })
};



// // // ==================================== LOGIN- for intial testing ====================================


// const login = (req, res, next) => {
//     // extract data (email and password) from the body of the POST request
//     const { email, password } = req.body


//     // want to search if we have a user with that email in our array
//     // and if we do, if the password is also equal to the passwor we get here
//     const identifiedUser = DUMMY_USERS.find(u => u.email === email)


//     // if we do find the user, we can continue. if it is falsey we can return/throw a new error
//     if (!identifiedUser || identifiedUser.password !== password) {


//         // if we don't find an identified user or if we find one and the passwords do not match
//         // the password we got in the body, then we return an error
//         // status error 401, which means authentication failed
//         throw new HttpError("Could not identify user. Please check your credentials and try again", 401);
//     }

//     // if we make it past this point, we found an actual user
//     res.json({ message: "Logged in!" })

// };

// // ==================================== LOGIN- FINAL ====================================
// still dummy code until updated in auth with actual token
// for now we are just checking the functionality of whether a user is existing or not
// or if the password entered is correct

const login = async (req, res, next) => {
    // extract data (email and password) from the body of the POST request
    const { email, password } = req.body

    // start with custom email validator
    let existingUser;

    try {
        existingUser = await User.findOne({ email: email })
    } catch (error) {
        error = new HttpError(
            "Logging in failed, please try again later.",
            500
        )
        return next(error)
    }

    // dummy validation to check if email and/or password is stored in the database
    if (!existingUser || existingUser.password !== password) {
        const error = new HttpError(
            "Invalid credentials, could not log you in,",
            401
        )
        return next(error)

    }

    // if we make it past this point, we found an actual user
    res.json({ message: "Logged in!" })

};



// module.export only allows us to export a single thing
// so we have to use a different syntax to export multiple things
exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;