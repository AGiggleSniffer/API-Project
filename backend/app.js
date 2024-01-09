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
	if (err.title === "Authentication required") {
		return res.json({ message: err.message });
	}

	if (err.message === "Forbidden") {
		return res.status(403).json({ message: err.message });
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

// Unhandled Error Handler
app.use((err, _req, res, _next) => {
	res.status(err.status || 500);
	console.error(err);
	res.json({
		title: err.title || "Server Error",
		message: err.message,
		errors: err.errors,
		stack: isProduction ? null : err.stack,
	});
});

module.exports = app;
