const express = require("express");
require("express-async-errors");
const morgan = require("morgan");
const cors = require("cors");
const csurf = require("csurf");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const { ValidationError } = require("sequelize");
/// Routes
const routes = require("./routes");

// chech production or dev
const { environment } = require("./config");
const isProduction = environment === "production";

// Initialize express
const app = express();

// morgan dependency for middleware logging info
app.use(morgan("dev"));

// parse cookie dependency
app.use(cookieParser());

// parse json common middleware
app.use(express.json());

///
/// Security Middleware
///

// enable cors only in development
if (!isProduction) {
	app.use(cors());
}

// helmet helps set a variety of headers to better secure your app
app.use(
	helmet.crossOriginResourcePolicy({
		policy: "cross-origin",
	}),
);

// Set the _csrf token and create req.csrfToken method
app.use(
	csurf({
		cookie: {
			secure: isProduction,
			sameSite: isProduction && "Lax",
			httpOnly: true,
		},
	}),
);

///
/// Routes
///

app.use(routes);

///
/// Error Handlers
///

// any unhandled requests
app.use((_req, _res, next) => {
	const err = new Error("The requested resource couldn't be found.");
	err.title = "Resource Not Found";
	err.errors = { message: "The requested resource couldn't be found." };
	err.status = 404;
	next(err);
});

// Error Handlers for common known errors
app.use((err, req, res, next) => {
	if (
		err.message === "Authentication required" ||
		err.message === "Invalid credentials"
	) {
		return res.json({ message: err.message });
	}

	if (
		err.message === "Forbidden" ||
		err.message === "Maximum number of images for this resource was reached" ||
		err.message === "Bookings that have been started can't be deleted"
	) {
		return res.status(403).json({ message: err.message });
	}

	if (err.message.includes("couldn't be found")) {
		return res.status(404).json({ message: err.message });
	}

	if (
		err.message === "Sorry, this spot is already booked for the specified dates"
	) {
		res.status(403);
	}

	return next(err);
});

// Process sequelize errors
app.use((err, _req, _res, next) => {
	// check if error is a Sequelize error:
	if (err instanceof ValidationError) {
		let errors = {};
		for (let error of err.errors) {
			errors[error.path] = error.message;
		}
		err.title = "Validation error";
		err.errors = errors;
	}
	next(err);
});

// Error Formatter
app.use((err, _req, res, _next) => {
	res.status(err.status || 500);
	console.error(err);

	const productionResponse = {};
	if (!isProduction) {
		productionResponse.title = err.title || "Server Error"; // not needed?
		productionResponse.stack = err.stack;
	}

	res.json({
		message: err.title || err.message,
		errors: err.errors,
		...productionResponse,
	});
});

module.exports = app;
