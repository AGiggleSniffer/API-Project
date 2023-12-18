const express = require("express");
require("express-async-errors");
const morgan = require("morgan");
const cors = require("cors");
const csurf = require("csurf");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
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

/// Security Middleware

// enable cors only in development
if (!isProduction) {
  app.use(cors());
}

// helmet helps set a variety of headers to better secure your app
app.use(
  helmet.crossOriginResourcePolicy({
    policy: "cross-origin"
  })
);

// Set the _csrf token and create req.csrfToken method
app.use(
  csurf({
    cookie: {
      secure: isProduction,
      sameSite: isProduction && "Lax",
      httpOnly: true
    }
  })
);

/// Routes
app.use(routes);

module.exports = app;