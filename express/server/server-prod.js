const path = require('path');
const express = require('express');
const cors = require('cors'),
logger = require("morgan"),
cookieParser = require("cookie-parser"),
routes = require("../routes"),
bodyParser = require('body-parser');

const app = express();

//view engine setup
app.set("views", path.join(__dirname, "../src"));
app.set("view engine", "ejs");

app.use(cors());
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
  });
  
  // error handler
  app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    console.log(err.message)
    // render the error page
    res.status(err.status || 500);
  });

// const PORT = process.env.PORT || 8080
// app.listen(PORT, () => {
//     console.log(`App listening to ${PORT}....`)
//     console.log('Press Ctrl+C to quit.')
// })

module.exports = app;