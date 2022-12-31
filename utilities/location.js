// import axios
// to send the request from inside a Node app, we have some built in core modules 
// that could help --but it is cumbersome to use them so we need to 
// install a third party package - the axios package
// the axios package sends Http requests from the frontend to the backend
// this package can also be used on Node server to send a request from there
// so npm install --save axios
// this will allow axios to send a request from the Node server to another server/ to another backend
const axios = require("axios");


// import http-error class by requiring it from models folder
const HttpError = require("../models/http-error")


const API_KEY = "AIzaSyAJ8IdKkJbXMcqWME1aDs7sMtB9GW1_mt0"


// the code we write will send the request to Google's API and get us the coordinates for a 
// given address


// this function  takes an address, reaches out to Google's Geocoding api and converst the address to coordinates

async function getCoordsForAddress(address) {
    // this is a dummy function in case this doesn't work
    // return {
    //     lat: 33.8053189,
    //     lng: -84.1455315
    // }

    // Geocoding request and response (latitude/longitude lookup)
    // The following example requests the latitude and longitude of "1600 Amphitheatre Parkway, Mountain View, CA", and specifies that the output must be in JSON format.
    // source: https://developers.google.com/maps/documentation/geocoding/start

    // now that we have the address, we need to convert it to get rid of whitespaces and special characters
    // we can do that with the help of a global function available in JS in Node.js
    // by using encode uri component function
    // we get the reponse by awaiting, which is available becuase we added async
    const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
            address
        )}&key=${API_KEY}`
    )

    // now we need to get the data out of the reponse
    // axios gives us a data field on the response object that holds our data
    const data = response.data;

    // first we check if the data is not set or if there is a status field
    // which is equal or holds a value of 0, by using ZERO_RESULTS
    // google will give us this field with this text if no coordinates
    // were found for a specific address
    // so this will handle the scenario that a user enetered a valid address when it comes to 
    // our validation so that when a non-empty field has an address that cannot be found
    if (!data || data.status === "ZERO_RESULTS") {

        // if we do get this response, we will create a new error 422 for invalid user input (could also be 404)
        const error = new HttpError(
            "Could not find location for specified address.",
            422
        )
        // throwing and error in an async function will throw an error for
        // everything wrapped in the promise 
        throw error;
    }
    // if we make it past this if check, we know we have no errors
    // so then we want to extract the coordinates and we get that from 
    // the data.results
    // only selecting the first element [0], because this turns out to be an array, 
    // but the first element best matches the given address
    // try 1 if this doesn't work
    const coordinates = data.results[0].geometry.location
    // you can find more information about the structure of the response 
    // we get from Google in their documentation
    // https://developers.google.com/maps/documentation/geocoding/start#geocoding-request-and-response-latitudelongitude-lookup

    // finally return the coordinates
    return coordinates
}

// export function so we can use it
module.exports = getCoordsForAddress

