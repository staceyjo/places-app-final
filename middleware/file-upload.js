// Multer is a node.js middleware for handling multipart/form-data, which is primarily used for uploading files.
// npm install --save multer

// we're going to use multer (which is a middleware)
// and wrap it for custom use as a function- fileUpload
const multer = require('multer');

// import uuid package
const { v4: uuidv4 } = require('uuid');

// MIME_TYPE_MAP is a JS object that we can use to map certain mime types
// that look like this: // "image/png" : "png" 
// will need to replicate for all the file types we are accepting in the frontend of the app
// multer also gives information about the mime type
// and the type of file we're dealing with
// so with MIME_TYPE_MAP we can be sure we deserive the right extension
const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
};

// so this is now a middleware/group of middlewares, that uses the multer middleware
// we have to tell it where to store something after it has been extracted
// we can alse tell it which files to accept

const fileUpload = multer({

    // this is a filter for a limit in bytes
    // 500000 bytes = 500 kb
    limits: 500000,

    // multer also takes a storage key, which requires a multer 
    // storage driver- the .diskStorage driver is bulit in
    // to the multer middleware
    // insde of the driver, we can set certain object properties on an object we provide to diskStorage
    // in order to configure the diskStorage for what we need it to do

    storage: multer.diskStorage({

        // the destination key controls the destination where files get stored
        // the destination function gets the request object, the file that was extracted and a callback
        // we have to call when we're done
        destination: (req, file, cb) => {

            // callback for the destination is a little more simple then the callback 
            // for the filename. We call callback, with no errors so we set it to null
            // as the first argument 
            // the second argument is the string which describes 
            // the path where we want to store this
            // so the /uploads/images folder
            cb(null, 'uploads/images');
        },


        // the filename key controls the filename that's being used
        // gets the same request objects as the destination

        filename: (req, file, cb) => {


            // for the file name, we need the file extension
            // to get the file extension, we can use the MIME_TYPE_MAP
            // and then dynamically access the property that matches 
            // the file.mimetype
            // the [file] is the file object given from multer
            // .mimtype will look like this: 'image/png'
            // then we can access the property from the type
            // and just wrap it in quotes to get the extension I want to use

            const ext = MIME_TYPE_MAP[file.mimetype];

            // then we call the callback, pass null as a first argument
            // we could also pass in an error
            // then the second argument is a unique id
            // can use the package installed earlier, uuid
            // to generate a random unique file 
            // then we add .
            // and then finally the extension
            // this is all handled internally by multer to use the filename
            cb(null, { v4: uuidv4 }() + '.' + ext);
        }

    }),


    // in addition to the disk storage configuration
    // we also have to configure the file filter
    // to validate that we don't get an invalid file
    // filtering files by type is another property that we can pass to the object
    // in multer
    // there' already some validation in the frontend 
    // in the imageupload.js file which has an accept
    // attribute on the input
    // but the frontend can be hacked or changed by the user
    // like that disable password issue in the inspect tools
    // so we can never rely on f/e validation-- bc its also a security risk
    // so this is why we need to filter the files on the backend
    // the file fileter function will receive a request object, 
    // the file, and the callback as arguments


    fileFilter: (req, file, cb) => {

        // so we need a way for the constant isValid to check
        // if the mime type is valid
        // in the MIMI_TYPE_MAP0 we pass in file.mimetype 
        // to see if the type is valid, ex: image/png' will retieve 
        // the png file type we need 
        // the double bang operator (!!) will convert null or 
        // undefined to false 
        // then we can convert one of the other two file types to true
        // its a way to store "is either true or false"
        const isValid = !!MIME_TYPE_MAP[file.mimetype];

        // now we can create the error
        // for the error we're checking if is valid is true
        // if it is true, we set it to null, meaning we have no error
        // but if isvalid is false, and we have some type of invalid upload
        // then we set it to a new Error
        // then we can forward the error to the cb
        let error = isValid ? null : new Error('Invalid mime type!');

        // call the call back either with an error if validation fails
        // or with null as a first argument if if succeced 
        // the second argument isValid is a boolean
        cb(error, isValid);
    }
});

// export the middleware so we can use it in other files
// like the user-routes.js file in the sign-up route
module.exports = fileUpload;