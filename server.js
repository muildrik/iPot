/********************************/
/*		SETUP VARIABLES			*/
/********************************/
var express			= require('express');
var app				= express();
var port			= process.env.PORT || 8080;
var morgan			= require('morgan');
var cookieParser	= require('cookie-parser');
var bodyParser		= require('body-parser');

app.use(morgan('dev'));
app.use(bodyParser());
//app.use(flash());
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.set('views', './public/pages');

require('./app/routes.js')(app);
app.listen(port);
console.log("Server listening on 8080");