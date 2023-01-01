
// place model/ schema
// MongoDB thinks in database collections and document logic
// MongoDB can contain one or multiple collections and a collection
// can contain one or multiple documents
// Each single document is a new place that we stored

// Mongoose thinks in schema and model logic
// A schema is the blueprint of a document that we want to store
// So the blueprint, or schema, for a place would contain a title, description, location, address, creator and id(created by Mongodb)
// Based on the schema, we can create the model
// and each instance of this model will result in a new document
// first import mongoose
const mongoose = require("mongoose");

// create the Schema constant to access mongoose schema method
const Schema = mongoose.Schema;

// creating our actual place Schema, instantiated from the mongoose schema
// which contains a JS object({})
// the object contains the logic for our blueprint of a later document
// the blueprint exists as the (dummy) code in our places-controllers.js file
const placeSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    address: { type: String, required: true },
    location: {
        lat: { type: Number, required: true},
        lng: { type: Number, required: true},
    },
    creator: { type: String, required: true },

});

// now that we have the Schema, we need to create the model
// then once we have the model, we can instantiate the model
// which will createt a document

// to create the model, we simply use module exports
// and set it equal to mongoose and use the .model() method
// This method available in mongoose will return a special constructor function

// we need to add arguments to this function:
// first argument is the name of the model
// naming convention is uppercase and singular form Place
// Place will also be the name of our collection in MongoDB
// Except in mongodb- it will no longer be uppercase and will take the plural form

// the second argument is the schema we want to refer to

module.exports = mongoose.model("Place", placeSchema);