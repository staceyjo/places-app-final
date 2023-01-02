// used npm i -- save uuid package to create unique user ids
// import { v4 as uuidv4 } from 'uuid';
const { v4: uuidv4 } = require('uuid');

// using validator to prevent user from entering place with missing info
const { validationResult } = require("express-validator");

// import http-error class by requiring it from models folder
const HttpError = require("../models/http-error");

// import function for geocoding
const getCoordsForAddress = require("../utilities/location");

// import place model
const Place = require("../models/place");


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
    const createdPlace = new Place({
        title,
        description,
        image: "https://img1.10bestmedia.com/Images/Photos/6617/p-StoneMountain_55_660x440_201404181445.jpg",
        address,
        location: coordinates,
        creator
    });

    try {
        // .save() is a method in mongoose and will handle all the 
        // Mongodb code to store a new document in the database collection
        // .save will also create the unique places id
        // .save is also a promise, so we can have an async task
        await createdPlace.save()

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
    // finding the place
    try {
        place = await Place.findById(placeId)
    } catch (error) {
        error = new HttpError(
            "Something went wrong, could not find to delete place",
            500
        )
        return next(error);
    }

    // deleting the place and saving it to database
    try {
        await place.remove()
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