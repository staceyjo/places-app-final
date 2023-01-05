# PLACES- The Full Stack MERN App

MERN stands for MongoDB, Express.js, React.js and Node.js - and combined, these four technologies helped me to build an application that allows users to share places (with images & location) with other users. 

![My Remote Image](https://i.ibb.co/c8nmPHt/Screen-Shot-2023-01-05-at-7-51-36-AM.png)

### MongoDB: 

The Places collection for the database is stored using MongoDB version 5.0.14. The database utilizes the shared tier cluster. 
[MongoDB documentation](https://docs.mongodb.com/)

### Express.js: 
This project uses express
[Express documentation](https://reactjs.org/docs/getting-started.html)

### React: 
This project was bootstrapped with npx create-react-app. In the project directory, you can run: `npm start` 
[React documentation](https://reactjs.org/docs/getting-started.html)

### Node.js:
The backend was created using Node.Js
[Node documentation](https://nodejs.org/en/docs/)

## Project features:
- sign up/login functionality(not real authentication)
- third party APIs
- models: user, place
- controllers: places, user
- routes: places, user
- components: places, user and shared
- multer middleware for file upload
- unique user identification uuid package
- express validator to check user entries
- express static middleware to get paths from Node.js
- react router dom
- React hooks
- File Reader Javascript browser api
- fs module to interact with files in the file system
- body parser for incoming JSON requests
- CSS styling

### CRUD
CRUD refers to the four basic operations a software application should be able to perform – Create, Read, Update, and Delete. CRUD apps consist of 3 parts: an API (or server), a database, and a user interface (UI). The API contains the code and methods, the database stores and helps the user retrieve the information, while the user interface helps users interact with the app. 

All CRUD (Create, Read, Update, Delete) methods covered

![My Remote Image](https://i.ibb.co/b7rjNyd/Screen-Shot-2023-01-05-at-7-44-31-AM.png)








### Development: Backend
- Backend: [http://localhost:5000](http://localhost:5000) to view it in your browser.

- Backend Repo: [https://github.com/staceyjo/places-app-final](https://github.com/staceyjo/places-app-final)



### Development: Frontend
- Frontend: [http://localhost:3000](http://localhost:3000) to view it in your browser.

- Frontend Repo: [https://github.com/staceyjo/places-app](https://github.com/staceyjo/places-app)



### Production
Used 'npm run build' to create the build folder for production. 



## Deployment: Render:

[https://places2.onrender.com/](https://places2.onrender.com/).



### Google Maps JavaScript API

This project uses the Google Maps API to display a map when a user creates a place. The api builds dynamic, interactive, deeply customized maps, location, and geospatial experiences for your web apps.

[https://developers.google.com/maps/documentation/javascript](https://developers.google.com/maps/documentation/javascript)



### Google Maps Geocoding JavaScript API

This project uses the Google Maps Geocoding API. Geocoding is the process of converting addresses (like "1600 Amphitheatre Parkway, Mountain View, CA") into geographic coordinates (like latitude 37.423021 and longitude -122.083739), which you can use to place markers or position the map.  

[https://developers.google.com/maps/documentation/javascript/geocoding](https://developers.google.com/maps/documentation/javascript/geocoding)


### Multer
Node.js middleware for handling `multipart/form-data`, which is primarily used for uploading files. I used the built in APIs to get the file path of the images which I needed for both file upload and adding and deleting images from disk storage.

[https://github.com/expressjs/multer](https://github.com/expressjs/multer)

[https://www.npmjs.com/package/multer](https://www.npmjs.com/package/multer)




### Postman

Learned how to use Postman. Postman also enables you to automate API testing, monitor API performance, mock APIs and more. It was helpful to test all the routes to make sure they worked before moving into the backend. 
Link to my workspace: [16712219-4a0e-4826-8d8e-7a17f7e0faa4](16712219-4a0e-4826-8d8e-7a17f7e0faa4)

![My Remote Image](https://i.ibb.co/42xHrxQ/Screen-Shot-2023-01-05-at-6-27-26-AM.png)



### Pexels

The images used for the app profile pictures were found on pexel: 
[https://www.pexels.com/collections/headshots-kxyislb/](https://www.pexels.com/collections/headshots-kxyislb/)




### Stack Overflow
Learned how to properly ask a question on Stack Overflow and earned some privledges and badges. See my question here: 
[https://stackoverflow.com/questions/74988661/typeerror-cannot-read-properties-of-undefined-reading-length](https://stackoverflow.com/questions/74988661/typeerror-cannot-read-properties-of-undefined-reading-length)

![My Remote Image](https://i.ibb.co/3SMLxdC/Screen-Shot-2023-01-02-at-11-06-43-PM.png)



### Errors

Accidently deleted logo192.png and logo512.png from the public folder. So these were removed from the /public/manifest.json to remove the error.

The web app manifest provides information about an application (such as name, author, icon, and description) in a JSON text file. The purpose of the manifest is to install web applications to the homescreen of a device, providing users with quicker access and a richer experience. 

![My Remote Image](https://i.ibb.co/FHq60S2/Screen-Shot-2023-01-05-at-5-57-10-AM.png)

![My Remote Image](https://i.ibb.co/J7kqc9G/Screen-Shot-2023-01-05-at-5-58-47-AM.png)


# Trello

![My Remote Image](https://i.ibb.co/wy0DDDQ/Screen-Shot-2023-01-05-at-1-15-46-PM.png)


### What I want to work on
- Deleting users
- Closing out a modals and going back to all users
- Adding real authentication



