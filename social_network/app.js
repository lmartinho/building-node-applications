var express = require('express');
var app = express();

var nodemailer = require('nodemailer');
var MemoryStore = require('connect').session.MemoryStore;

// Import the data layer
var mongoose = require('mongoose');
var config = {
	mail: require('./config/mail')
};

// Import the accounts
var Conta = require('./models/Account')(config, mongoose, nodemailer);

app.configure(function() {
	app.set('view engine', 'jade');
	app.use(express.static(__dirname + '/public'));
	app.use(express.limit('1mb'));
	app.use(express.bodyParser());
	app.use(express.cookieParser());
	app.use(express.session({
		secret: "SocialNet secret key",
		store: new MemoryStore()
	}));

	mongoose.connect('mongodb://localhost/nodebackbone');
});

app.get('/', function(req, res){
	res.render("index.jade", {layout: false});
});

app.get('/account/authenticated', function(req, res) {
	if(req.session.loggedIn) {
		res.send(200);
	} else {
		res.send(401); // unauthorized
	}
});

app.post('/register', function(req, res) {
	var firstName = req.param('firstName', '');
	var lastName = req.param('lastName', '');
	var email = req.param('email', null);
	var password = req.param('password', null);

	if(email == null || password == null) {
		res.send(400);
		return;
	}

	Conta.registar(email, password, firstName, lastName);
	res.send(200);
});

app.post('/login', function(req, res) {
	console.log('login request');
	var email = req.param('email', null);
	var password = req.param('password', null);

	if(email == null || email.length < 1 || password == null || password.length < 1) {
		res.send(400);
		return;
	}

	Conta.login(email, password, function(success) {
		if(!success) {
			res.send(401);
			return;
		}
		console.log('login was successful');
		res.send(200);
	});
});

app.post('/forgot-password', function(req, res) {
	var hostname = req.headers.host;
	var resetPasswordUrl = 'http://' + hostname + '/reset-password';

	var email = req.param('email', null);
	if(email == null || email.length < 1) {
		res.send(400);
		return;
	}

	Conta.esqueciPassword(email, resetPasswordUrl, function(success){
		if(success) {
			res.send(200);
		} else {
			// Username or password not found
			res.send(404);
		}
	});
});

app.get('/reset-password', function(req, res) {
	var accountId = req.param('account', null);
	res.render('reset_password.jade', {accountId: accountId});
});

app.post('/reset-password', function(req, res) {
	var accountId = req.param('accountId', null);
	var password = req.param('password', null);
	if(accountId != null && password != null) {
		Conta.mudarPassword(accountId, password);
	}

	res.render('reset_password_success.jade');
});

app.listen(8080);