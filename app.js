const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const pageRoute = require("./routes/pageRoute");
const courseRoute = require("./routes/courseRoute");
const categoryRoute = require("./routes/categoryRoute");
const userRoute = require("./routes/userRoute");

const app = express();

//connect DB
mongoose.connect("mongodb://127.0.0.1/smartedu-db").then(() => {
  console.log("DB Connected Succesfully");
});

//Template engine
app.set("view engine", "ejs");

//Global Variable

global.userIN = null;

//Middlewares

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "my_keyboard_cat",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: 'mongodb://127.0.0.1/smartedu-db' })
  })
);


//Routes
app.use("*", (req, res, next) => {
  userIN = req.session.userID;
  next();
});

app.use("/courses", courseRoute);
app.use("/category", categoryRoute);
app.use("/users", userRoute);
app.use("/", pageRoute);

const port = 3000;

app.listen(port, () => {
  console.log(`app started on port ${port}`);
});
