// used npm i -- save uuid package to create unique user ids
// import { v4 as uuidv4 } from 'uuid';
const { v4: uuidv4 } = require('uuid');

// using validator to prevent user from entering place with missing info
const { validationResult } = require("express-validator");

// using mongoose for session & transaction  
const mongoose = require("mongoose")
// const { default: mongoose } = require('mongoose');

// import http-error class by requiring it from models folder
const HttpError = require("../models/http-error");

// import function for geocoding
const getCoordsForAddress = require("../utilities/location");

// import place model
const Place = require("../models/place");

// import user model to create a new place and to add it to user
const User = require("../models/user");



// will be replaced with database access
let DUMMY_PLACES = [
    {
        id: 'p1',
        title: 'Stone Mountain',
        description: '16 miles east of Atlanta, a quartz monzonite dome monadnock surrounded by 3200 acres of natural beauty!',
        imageUrl:
            'https://img1.10bestmedia.com/Images/Photos/6617/p-StoneMountain_55_660x440_201404181445.jpg',
        address: '1000 Robert E Lee Blvd, Stone Mountain, GA 30083',
        location: {
            lat: 33.8053189,
            lng: -84.1455315
        },
        creator: 'u1'
    },
    {
        id: 'p2',
        title: 'Empire State Building',
        description: 'One of the most famous sky scrapers in the world!',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg',
        address: '20 W 34th St, New York, NY 10001',
        location: {
            lat: 40.7484405,
            lng: -73.9878584
        },
        creator: 'u2'
    }
];



// ================================================ READ- by id ================================================
// Alternatively could use:
// function getPlaceById() {...}
// or
// const getPlaceById= function () {...}


const getPlaceById = async (req, res, next) => {
    // console.log("GET request in places")
    const placeId = req.params.pid // { pid: "p1" }

    // for intial testing:
    // const place = DUMMY_PLACES.find(p => {
    //     return p.id === placeId;
    // })

    let place;
    try {
        // using the model
        place = await Place.findById(placeId)

    } catch (error) {
        error = new HttpError(
            "Something went wrong, could not find a place with this id",
            500
        )
        return next(error)
    }


    // error handling ---for initial testing
    // if (!place) {

    // using the error model
    // for initial test
    // throw new HttpError("Could not find a place for the provided id", 404);

    // create an error to test to trigger error handling middleware
    // const error = new Error('Could not find a place for the provided id.')
    // error.code = 404;
    // throw error;

    // One way to do this:
    // return res
    // .status(404)
    // .json({ message: "Could not find a place for the provided id." });

    // another way to do this:
    // next(error);

    // }

    // error handling:
    if (!place) {
        //
        const error = new HttpError(
            "Could not find a place for the provided id",
            404
        );
        return next(error)

    }

    // res.json({ message: "It works!" });
    // res.json({ place }); // => for testing

    // in our response, we turn the place into a js object by adding the .toObject
    // method. To get rid of the underscore, we can use {getters} 
    // and set it to true 
    // Mongoose adds an id getter to every document which returns the id as a string
    res.json({ place: place.toObject({ getters: true }) })
}





// ================================================ READ- by user/creator id ================================================

const getPlacesByUserId = async (req, res, next) => {
    const userId = req.params.uid;

    // for initial testing
    // const places = DUMMY_PLACES.filter(p => {
    //     return p.creator === userId;
    // });

    let places;
    try {
        // using find by itself would find all places
        // so we need to find a specific place by user id by using creator property
        // and specify the userId we defined in the constant
        places = await Place.find({ creator: userId })
    } catch (error) {
        error = new HttpError(
            "Fetching places failed, please try again later",
            500
        )
        return next(error)
    }

    // error handling if we don't have places or 
    if (!places || places.length === 0) {

        // create an error to test to trigger error handling middleware
        // using error model:
        return next(
            new HttpError("Could not find places for the provided user id.", 404)
        )

        // another way to do this
        // const error = new Error('Could not find a place for the provided user id.')
        // error.code = 404;
        // return next(error);
    }

    // res.json({ places }) // for testing
    // we need to add a method to places, but we cannot use .toObject
    // because find returns contains an array, so we use 
    // have to use .map() method
    // then we apply getters feature to make sure the underscore 
    // from the id property is removed
    res.json({ places: places.map(place => place.toObject({ getters: true })) })
}



// ================================================ READ- by user/creator id- alternative way ================================================
// ================================================ Not working ================================================

// const getPlacesByUserId = async (req, res, next) => {
//     const userId = req.params.uid;

//     // let places;
//     let userWithPlaces
//     try {
//         userWithPlaces = await User.findbyId(userId).populate("places")
//     } catch (error) {
//         error = new HttpError(
//             "Fetching places failed, please try again later",
//             500
//         )
//         return next(error)
//     }
//     if (!userWithPlaces || userWithPlaces.places.length === 0) {
//         return next(
//             new HttpError("Could not find places for the provided user id.", 404)
//         )

//     }
//     res.json({ places: userWithPlaces.places.map(place => place.toObject({ getters: true })) })
// }


// ================================================ CREATE ================================================

// changing to async function in order to use getCoordsForAddress
// so we can use await and work with promises
// will replace throw with next
const createPlace = async (req, res, next) => {
    // in the middleware functions that are triggered by the routes that 
    // have validation--calling validationResult will check
    // if any validation errors are detected
    const errors = validationResult(req);

    // the validationResult has a method .isEmpty, we'll thow an error
    if (!errors.isEmpty()) {
        //the errors object has more data
        console.log(errors)
        return next(
            new HttpError("Invalid inputs passed, please check your data.", 422)
        )
    }

    // expect data in POST request, to get data we can use the bodyParser package
    const { title, description, address, creator } = req.body;

    // using the object destructuring above is a shortcut of this:
    // const = title = req.body.title for each property

    // convert the address to coordinates by passing in the address 
    // pass in await since this returns a promise

    // 
    let coordinates;
    // this WILL throw an error and crash if it is not wrapped in try/catch
    try {
        coordinates = await getCoordsForAddress(address)
    } catch (error) {
        return next(error)
    }

    // For initial testing:
    // creating a new place:
    // const createdPlace = { 
    // id: uuidv4(),
    // title,
    // description,
    // location: coordinates,
    // address,
    // creator
    // };

    // DUMMY_PLACES.push(createdPlace) // created place will be added to dummy places. unshift(createdPlace) method would work if you want to add it as the first element


    // instantiate new place with Place constructor
    // which will create a new js object that we can use to add data to our model
    // what the model needs is predetermined by that properties in our schema

    // Note: changing the data type of the creator field from string since we 
    // established a connection between places and users,
    // it will now be a special type which MongoDB uses to manage IDs
    // since now we store a real MongoDB ID in this field now instead of the
    // dummy string we were using before
    const createdPlace = new Place({
        title,
        description,
        image: "https://img1.10bestmedia.com/Images/Photos/6617/p-StoneMountain_55_660x440_201404181445.jpg",
        address,
        location: coordinates,
        creator
    });

    // instead of immediately saving this place, we need to check
    // whether the user ID we provided exists already, if it does
    // we should be able to create a new place

    // first we need to find the user by id, by using the creator id
    // and check whethere the creator id of the logged in user is stored
    let user;
    try {
        user = await User.findById(creator)

    } catch (error) {
        error = new HttpError(
            "Creating place failed, please try again"
        )
        return next(error)
    }


    // if the check is succesful, we can check the ID of the creator
    // if the user is not existing, the user is not in the database
    if (!user) {
        error = new HttpError(
            "Could not find user for provided id",
            404
        )
        return next(error)
    }
    console.log(user)


    try {
        // .save() is a method in mongoose and will handle all the 
        // Mongodb code to store a new document in the database collection
        // .save will also create the unique places id
        // .save is also a promise, so we can have an async task

        // await createdPlace.save()

        // now instead of just saving, we can store/create
        // the new document with the new place and 
        // add the new place ID to the corresponding user
        // so were doing two things, by executing multiple/different
        // operations which are not directly related to eachother
        // and we only want to continue if both succeed
        // if one of them fails ( so creating the place fails OR
        // if storing the ID of the place in our user document fails
        // then we undo all operations) and not change anything in documents
        // if both succeed, then we want to change the document
        // to do this, we need to use transactions and settings
        // transactions allows you to perform multiple operations in isolation
        // of one another
        // transactions are built on sessions
        // so first we start a session to work with transactions
        // once the transaction is succesful, then the session is finished
        // and then the transaction is committed 

        // current session when we want to establish new place by setting
        // a constant and use the .startSession() method built in mongoose

        const sess = await mongoose.startSession()

        // now we can start the transaction
        sess.startTransaction()

        // tell mongoose what you want it to do
        // save in the database by providing session property
        // and refer to our current session 
        await createdPlace.save({ session: sess })

        // now the place is stored, and with the place being created
        //  we can make sure the new place ID is added to the user
        // by using .push() method to add to the previously creeated places
        user.places.push(createdPlace)

        // now we have to save the newly updated user, as part of the current session
        await user.save({ session: sess })

        // only when all these tasks are succesful, the session
        // can now commit the transaction
        await sess.commitTransaction()


    } catch (error) {
        error = new HttpError(
            "Creating place failed, please try again",
            500
        )
        return next(error)
    }
    // send back a response. 201 is a standard code if something was successfully created on server (200 is normal success status code)
    res.status(201).json({ place: createdPlace })
};





// ================================================ UPDATE ================================================

const updatePlace = async (req, res, next) => {
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


    const { title, description } = req.body;

    const placeId = req.params.pid;

    // For initial testing:
    // search for the place, using spread operator creates a new object and copies all key value pairs of old object as key value pairs in new object 

    // const updatedPlace = { ...DUMMY_PLACES.find(p => p.id === placeId) }
    // const placeIndex = DUMMY_PLACES.findIndex(p => p.id === placeId)

    // updatedPlace.title = title;
    // updatedPlace.description = description

    // DUMMY_PLACES[placeIndex] = updatedPlace


    let place;
    try {
        place = await Place.findById(placeId)
    } catch (error) {
        error = new HttpError(
            "Something went wrong, could not update place.",
            500
        )
        return next(error)
    }

    place.title = title;
    place.description = description

    // now we need to store the updated place
    try {
        await place.save()
    } catch (error) {
        error = new HttpError(
            "Something went wrong, could not update place",
            500
        )
        return next(error)
    }

    // for inital testing
    // res.status(200).json({ place: updatedPlace })

    // for the response, we will again convert the mongoose object
    // to a normal JS object and get rid of our underscore IDs
    // from the id property
    res.status(200).json({ place: place.toObject({ getters: true }) })
}



// ================================================ DELETE ================================================
// For initial test
// const deletePlace = (req, res, next) => {
//     const placeId = req.params.pid;

// // checking if a place exists before deleting
// // if there is a place found, where the id is equal to the placeId we are trying to remove this makes it true
// // if this is not the case, 
// if (!DUMMY_PLACES.find(p => p.id === placeId)) {
//     // then we throw an error if there is no id matching
//     throw new HttpError("Could not find a place for that id", 404)
// }


// // .filter is a default method available on Javascript arrays, it returns a brand new array filtered per our function
// // here I return p.id not equal placeID which means return true and therefore keep the place if IDs do not match.
// DUMMY_PLACES = DUMMY_PLACES.filter(p => p.id !== placeId)

// // send back a response
// res.status(200).json({ message: "Deleted place" })
// }

const deletePlace = async (req, res, next) => {
    const placeId = req.params.pid;

    let place;
    // finding the place by Id in order to delete it
    // at the same time, we want to search the user collection
    // and see which user has this place
    // then we want to make sure that if we delete the place, 
    // the place ID is deleted from the user document
    // in order to do this, we need to access to the user document
    // in order to overwrite/ change existing information
    // to do this, we use the populate method to refer to 
    // a document stored in another collection and to work
    // with data in that existing document of the other collection
    // To do that, we need a relation between the two documents
    // the relation was established in user.js with ref Place
    // and place.js with ref: User
    // so we just need to let populate know which property
    // to refer to in the document
    // in this case, the creator property-- which constains
    // the user id
    // Mongoose then takes this and searches through the entire user data
    // stored in a user document
    try {
        place = await Place.findById(placeId).populate("creator")
    } catch (error) {
        error = new HttpError(
            "Something went wrong, could not find to delete place",
            500
        )
        return next(error);
    }


    // checks if a place ID actually exists
    // if we don't find place by the provided it, we return an erro
    if (!place) {
        const error = new HttpError(
            "Could not find place for this id",
            404
        )
        return next(error)
    }




    // deleting the place by removing it and pulling it from the database
    // so we'll need a session to start the transaction

    try {
        // await place.remove()

        //set the constant for the current session
        const sess = await mongoose.startSession();

        // with the session we can start the transaction
        sess.startTransaction()

        // first we need to remove place from the collection
        // to do that we check if the place exists
        // by adding the session property and referring to the current session
        await place.remove({ session: sess })

        // now we access the place stored in the creator (place id)
        // and then we pull the place
        // pull will automatically remove the id
        place.creator.places.pull(place)

        // now we can save the user by referring to the current session
        await place.creator.save({ session: sess })

        // if all was successful, we can commit the transaction
        await sess.commitTransaction()



    } catch (error) {
        error = new HttpError(
            "Something went wrong, could not delete place",
            500
        )
        return next(error);
    }

    res.status(200).json({ message: "Deleted place" })
}


// module.export only allows us to export a single thing
// so we have to use a different syntax to export multiple things
exports.getPlaceById = getPlaceById
exports.getPlacesByUserId = getPlacesByUserId
exports.createPlace = createPlace
exports.updatePlace = updatePlace
exports.deletePlace = deletePlace