// user model/ schema
// MongoDB thinks in database collections and document logic
// MongoDB can contain one or multiple collections and a collection
// can contain one or multiple documents
// Each single document is a new user that we stored

// Mongoose thinks in schema and model logic
// A schema is the blueprint of a document that we want to store
// So the blueprint, or schema, for a user would contain a name, email, password  and image
// Based on the schema, we can create the model
// and each instance of this model will result in a new document

// first import mongoose
const mongoose = require("mongoose");

// import validator for email to make sure we have a unique email
const uniqueValidator = require("mongoose-unique-validator")


// create the Schema constant to access mongoose schema method
const Schema = mongoose.Schema;

// creating our actual user Schema, instantiated from the mongoose schema
// which contains a JS object({})
// the object contains the logic for our blueprint of a later document
// the blueprint exists as the (dummy) code in our users-controllers.js file
const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    password: { type: String, required: true, minlength: 6 },


    // places: { type: String, required: true }, // for testing

    // for places- we want MongoDB to create the id
    // the ref property allows us to establish the connection 
    // between the current place schema and another schema(user)
    // also one user can have multiple places, so it needs to be an array
    places: [{ type: mongoose.Types.ObjectId, required: true, ref: "Place" }]

});

// for email, unique only creates an internal index in the database
// we need internal validation of whether the email exists
// to do that we can use a third party package: mongoose unique validator
// install with npm install --save mongoose-unique-validator
// and then add it to the schema using the plugin method
userSchema.plugin(uniqueValidator)



// now that we have the Schema, we need to create the model
// then once we have the model, we can instantiate the model
// which will create a document

// to create the model, we simply use module exports
// and set it equal to mongoose and use the .model() method
// This method available in mongoose will return a special constructor function

// we need to add arguments to this function:
// first argument is the name of the model
// naming convention is uppercase and singular form User
// User will also be the name of our collection in MongoDB
// Except in mongodb- it will no longer be uppercase and will take the plural form

// the second argument is the schema we want to refer to

module.exports = mongoose.model("User", userSchema);