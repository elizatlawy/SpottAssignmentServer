var createError = require('http-errors');
var path = require('path');
var logger = require('morgan');
var express = require('express')
    , cors = require('cors')
    , app = express();

var productRouter = require('./routes/products');
var cogsRouter = require('./routes/cogs');

// just to handle CORE request that sent before POST form local browser
const corsOptions = {
    origin: true,
    credentials: true
}
app.options('*', cors(corsOptions)); // preflight OPTIONS; put before other routes


// // test
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/products', productRouter);
app.use('/cogs', cogsRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
