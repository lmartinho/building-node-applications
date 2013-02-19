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
//var Status = require('./models/Status')(config, mongoose);
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

	mongoose.connect('mongodb://localhost/nodebackbone', function onMongooseError(err) {
		if(err) throw err;
	});
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

	Conta.entrar(email, password, function(account) {
		if(!account) {
			res.send(401);
			return;
		}
		req.session.loggedIn = true;
		req.session.accountId = account._id
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

app.get('/accounts/:id', function(req, res) {
	var accountId = req.params.id == 'me' ? req.session.accountId : req.params.id;

	Conta.encontrarPorId(accountId, function(account) {
		res.send(account);
	});

});

app.get('/accounts/:id/status', function(req, res) {
	var accountId = req.params.id == 'me' ? req.session.accountId : req.params.id;
	Conta.encontrarPorId(accountId, function(account) {
		res.send(account.status);
	});
});

app.post('/accounts/:id/status', function(req, res) {
	var accountId = req.params.id == 'me' ? req.session.accountId : req.params.id;
	Conta.encontrarPorId(accountId, function(account) {
		status = {
			name: account.name,
			status: req.param('status', '')
		};
		account.status.push(status);

		// Push the status to all friends
		account.activity.push(status);
		account.save(function(err) {
			if(err) {
				console.log('Error saving account: ' + err);
			}
		});
	});
	res.send(200);
});

app.get('/accounts/:id/activity', function(req, res) {
	var accountId = req.params.id == 'me' ? req.session.accountId : req.params.id;

	Conta.encontrarPorId(accountId, function(account) {
		res.send(account.activity);
	});
});

app.listen(8080);