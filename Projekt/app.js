const express = require("express");
const app = express()
const expressHandlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const { query, request, response } = require("express");
const expressSession = require("express-session");
const bcrypt = require("bcrypt");
const db = require("./db.js");
const postsRouters = require("./routers/posts-Routers");
const questionsRouters = require("./routers/question-Routers");
const ADMIN_USERNAME = "Gabriel";
const ADMIN_PASSWORD =
  "$2b$10$VlAVabTgjaVCHdOJMC3SXO9juUm.4dEHsa2XWk4pZJpS0vWl0pr1i";

app.use(
  expressSession({
    secret: "abcdefgh",
    saveUninitialized: false,
    resave: false,
  })
);

app.use(express.static("public"));
app.use("/css", express.static(__dirname + "/node_modules/bootstrap/dist/css"));
app.use("/js", express.static(__dirname + "/node_modules/bootstrap/dist/js"));

app.engine(
  "hbs",
  expressHandlebars.engine({
    defaultLayout: "main.hbs",
  })
);

app.use(express.static("public"));

app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

app.use(function (request, response, next) {
	const isLoggedIn = request.session.isLoggedIn;
  response.locals.isLoggedIn = isLoggedIn;
  next();
});

app.use("/posts", postsRouters);

app.use("/questions", questionsRouters);

app.get("/", (request, response) => {
  response.render("index.hbs");
});

app.get("/about", (request, response) => {
  response.render("about.hbs");
});

app.get("/login", (request, response) => {
  response.render("login.hbs");
});

app.post("/login", (request, response) => {
  const entered_USERNAME = request.body.username;
  const entered_PASSWORD = request.body.password;

  if (entered_USERNAME == ADMIN_USERNAME && bcrypt.compareSync(entered_PASSWORD, ADMIN_PASSWORD)){
    request.session.isLoggedIn = true;
    response.redirect("/");
  }else{
    response.redirect("/posts");
  }
});

app.post("/logout", function (request, response) {
  request.session.isLoggedIn = false;
  response.redirect("/login");
});


app.listen(8080);
