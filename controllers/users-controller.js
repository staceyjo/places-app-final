// used npm i -- save uuid package to create unique user ids
// import { v4 as uuidv4 } from 'uuid';
const { v4: uuidv4 } = require('uuid');

// using validator to prevent user from entering place with missing info
const { validationResult } = require("express-validator")



// import http-error class by requiring it from models folder
const HttpError = require("../models/http-error")



const DUMMY_USERS = [
    {
        id: "u1",
        name: "Stacey Joseph",
        email: "test@test.com",
        password: "testers"
    }

];



// midelware functions

const getUsers = (req, res, next) => {

    // return the array of users
    // send back a response
    res.json({ users: DUMMY_USERS })
};



const signup = (req, res, next) => {
    // in the middleware functions that are triggered by the routes that 
    // have validation--calling validationResult will check
    // if any validation errors are detected
    const errors = validationResult(req);

    // the validationResult has a method .isEmpty, we'll thow an error
    if (!errors.isEmpty()) {
        //the errors object has more data
        console.log(errors)
        throw new HttpError("Invalid inputs passed, please check your data.", 422)
    }


    // create a new user by extracting data(name, email, password) from incoming request body
    const { name, email, password } = req.body;


    // want to be sure we aren't able to create a new user with the same email
    const hasUser = DUMMY_USERS.find(u => u.email === email)


    // if that is true and we found a user that exists
    // we want to throw an Http error with a status code of 422
    // 422 is typically used for invalid user input
    if (hasUser) {
        throw new HttpError("Could not create user, email address already exists", 422);

    }


    // create the new user
    const createdUser = {
        id: uuidv4(),
        name, // name: name
        email,
        password
    }

    // add new user to DUMMY USERS array. unshift would work if you want to push new element to start of array
    DUMMY_USERS.push(createdUser)


    // send back a response, 201 since we are creating new data
    res.status(201).json({ user: createdUser })
};




const login = (req, res, next) => {
    // extract data (email and password) from the body of the POST request
    const { email, password } = req.body


    // want to search if we have a user with that email in our array
    // and if we do, if the password is also equal to the passwor we get here
    const identifiedUser = DUMMY_USERS.find(u => u.email === email)


    // if we do find the user, we can continue. if it is falsey we can return/throw a new error
    if (!identifiedUser || identifiedUser.password !== password) {


        // if we don't find an identified user or if we find one and the passwords do not match
        // the password we got in the body, then we return an error
        // status error 401, which means authentication failed
        throw new HttpError("Could not identify user. Please check your credentials and try again", 401);
    }

    // if we make it past this point, we found an actual user
    res.json({ message: "Logged in!" })

};


// module.export only allows us to export a single thing
// so we have to use a different syntax to export multiple things
exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;