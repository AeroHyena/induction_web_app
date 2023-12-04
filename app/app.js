/**
 * @module app
 *
 * @summary Entry point. Sets up tools, the server, and holds all routes.
 *
 * @overview This is the entry point for the web app.
 * In this file an express app is created, and all route modules from
 * app/routes are imported and set up.
 *
 * Routes generate html files using the ejs template engine.
 * There is a Template.ejs file with common page elements,
 * and each route has an ejs file with page-sepcific content.
 * On route access, the template and route ejs files are combined and served.
 *
 * This script sets app/pages/media as a directory from which static
 * files - media content - is served.
 */

/** Imports */
const path = require("path");
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const session = require("express-session");
const passport = require("passport");
const crypto = require("crypto");
const RateLimit = require("express-rate-limit");
const helmet = require("helmet");
const emailer = require("./emailer");
const sqlite = require("better-sqlite3");

// Set up logger
//const {logger, requestLogger} = require("./logger");

// Set up the app
console.log("App: initializing set up ...");

/** Handle environment variables */
const SECRET_KEY = crypto.randomBytes(256).toString("hex");

/** @default The server is served on the PORT environment variable, or on 8080 by default. */
const port = process.env.PORT || 8080;
const host = process.env.host || "0.0.0.0";

/** Set up the sqlite3 database */
console.log("App: setting up database...");
const db = new sqlite3.Database("database.db"); // set up a database connection

/**
 * Create tables for induction data and users if one doesn't exist.
 *
 * Create an entry in the users table to ensure
 * one user is present.
 * */
db.serialize(() => {
  db.run(
    `
    CREATE TABLE IF NOT EXISTS inductions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date_completed DATE DEFAULT CURRENT_TIMESTAMP,
      id_passport_nr TEXT UNIQUE,
      full_name TEXT NOT NULL,
      employee_nr INTEGER UNIQUE,
      company_contractor TEXT,
      video_watched TEXT NOT NULL
    )`,
    (error) => {
      if (error) {
        console.error("Error creating inductions table: ", error);
        return;
      }
    }
  );

  db.run(
    `CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL
  )`,
    (error) => {
      if (error) {
        console.error("Error creating users table: ", error);
        return;
      }
    }
  );

  db.get(
    `SELECT * FROM users WHERE username = "admin@email.com"`,
    (error, row) => {
      if (error) {
        console.error("error getting data: ", error);
        return;
      }
      if (!row) {
        db.run(
          `
        INSERT INTO users (username, password, role) VALUES ("admin@email.com",
        "$2a$10$BXdews2Olt7KAjqCjkS2s.F/sQbfEwYhHfxTjmSOHsofuGjdPUx6O", 
        "administrator")`,
          (error) => {
            if (error) {
              console.error("error inserting user data: ", error);
              return;
            }
          }
        );
      }
    }
  );
});

// Set up emailer
const report = new emailer.Emailer(db);

/** Set up the express app to be used */
console.log("App: setting up express.js  ...");
const app = express();
app.use(express.static(path.join(__dirname, "pages"))); // Serve static files from the pages directory
app.use(express.urlencoded({ extended: true })); //parse URL-encoded data
app.set("db", db); // Set the database in the app
app.set("emailer", report); // set the emailer in the app
//app.use(requestLogger);

/** Set up session middleware */
console.log("App: setting up session middleware...");
const SqliteStore = require("better-sqlite3-session-store")(session);
const dbSessions = new sqlite("sessions.db", { verbose: console.log });
app.use(
  session({
    store: new SqliteStore({
      client: dbSessions,
      expired: {
        clear: true,
        intervalMs: 900000, //ms = 15min
      },
    }),
    secret: SECRET_KEY,
    resave: false,
  })
);

/** Set up passport.js */
console.log("App: Setting up passport.js ...");
require("./authenticate")(passport, db);
app.use(passport.initialize());
app.use(passport.session());

/** Set up the ejs template engine */
console.log("App: Setting up ejs ...");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "pages")); // Set the directory of web files as /pages

/** Set up rate limiter */
console.log("App: setting up rate limiter ...");
const limiter = RateLimit({
  windowsMs: 15 * 60 * 1000, // 15 mins
  max: 100, // max 100 request per windowsMs
});

app.use(limiter);

// Set up HelmetJS
console.log("App: Setting up HelmetJS ...");

app.use(helmet.hidePoweredBy()); // Hide X-Powered-By;
app.use(helmet.frameguard({ action: "deny" })); // Hide the use of this app in iframes
app.use(helmet.xssFilter()); // Sanitize input sent to the serer
app.use(helmet.noSniff()); // Avoid the bypassing of Content-Type
app.use(helmet.ieNoOpen()); // Prevent IE from opening untrusted html

// Setup complete
console.log("App: set up complete.");

/* import and use routes */
/** Import route modules and pass in the database connec connection to the route modules */
const inductionRoutes = require("./routes/induction/induction")(app);
const GroupInductionsRoutes =
  require("./routes/group_inductions/group_inductions.js")(app);
const searchRoutes = require("./routes/search/search.js")(app);
const reportsRoutes = require("./routes/reports/reports.js")(app);
const loginRoutes = require("./routes/login/login.js")(app);
const logoutRoutes = require("./routes/logout/logout.js");
const dashboardRoutes = require("./routes/dashboard/dashboard.js")(app);

/** Use the Route modules */
app.use("/", inductionRoutes);
app.use("/group_inductions", GroupInductionsRoutes);
app.use("/search", searchRoutes);
app.use("/reports", reportsRoutes);
app.use("/login", loginRoutes);
app.use("/logout", logoutRoutes);
app.use("/dashboard", dashboardRoutes);

/** launch server on the specified port, and on host 0.0.0.0 */
app.listen(port, host, () => {
  console.log("App: server is running on port " + port);
});
