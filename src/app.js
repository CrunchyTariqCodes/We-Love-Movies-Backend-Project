//configuration imports
if (process.env.USER) require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");

//router imports
const moviesRouter = require("./movies/movies.router");
const reviewsRouter = require("./reviews/reviews.router");
const theatersRouter = require("./theaters/theaters.router");
const errorHandler = require("./errors/errorHandler");
const notFound = require("./errors/notFound");

//enable cross origin resource sharing
app.use(cors());
//converting transferred data to json format
app.use(express.json());

//connecting base routes to their corressponding router files
app.use("/movies", moviesRouter);
app.use("/theaters", theatersRouter);
app.use("/reviews", reviewsRouter);

//error handlers
app.use(notFound);
app.use(errorHandler);

module.exports = app;
