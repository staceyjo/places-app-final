// A model is basically a blueprint for a JS data object we work with

class HttpError extends Error {
    constructor(message, errorCode) {
        super(message) // Adds a message property
        this.code = errorCode //Adds a code property

    }
}

module.exports = HttpError