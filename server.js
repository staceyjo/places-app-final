const express = require("express");
// middleware ensures we parse the body of incoming requests
const bodyParser = require("body-parser");
// middleware
const placesRoutes = require("./routes/places-routes")

const app = express();

// register middleware
app.use("/api/places" , placesRoutes); // => /api/places/...

// calling app to listen on port
app.listen(5000)
