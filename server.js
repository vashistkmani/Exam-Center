// Model require...
const express = require("express");
const path = require("path");
const app = express();


// -- importing file ...............
const router = require('./router/router');
const session = require("./middleware/session");
require("./config/database");
// body parser .......................................
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//----------- static path ................................
const staticpath = path.join(__dirname, 'public');
app.use(express.static(staticpath));

// view engine  .......................
const view = path.join(__dirname, 'view');
app.set("view engine", 'ejs');
app.set("views", view)

// app useee  -------------------------------
app.use(session);
app.use(router);

// ------------------- server --------------------------------------
const Port = 5555;
app.listen(Port, () => {
    console.log(`Server = http://localhost:${Port}`);
});