// Dependencies
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const passport = require("passport");

// Local Files
const users = require("./routes/users");
const { testConnection, createUsersTable, createEmployeesTable, createProfileTable } = require("./utils/database");
require("./config/passportConfig")(passport);

const port = process.env.PORT;
const app = express();

// Essential Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(passport.initialize());
app.use(cors());

// Routes
app.use("/api/users", users);

// Database Connection and Configuration
testConnection();
createUsersTable();
createEmployeesTable();
createProfileTable();

app.listen(port, () => {
  console.log("Server Listening on PORT:", port);
});
