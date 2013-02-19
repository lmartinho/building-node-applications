// exposing API in pt-PT to deviate from the book's code just enough to get into trouble,
// also because I can
module.exports = function(config, mongoose, Status, nodemailer) {
	var crypto = require('crypto');

	var Status = new mongoose.Schema({
		name: {
			first: {type: String},
			last: {type: String}
		},
		status: {type: String}
	})

	var EsquemaDeConta = new mongoose.Schema({
		email: {type: String, unique: true},
		password: {type: String},
		name: {
			first: {type: String},
			last: {type: String}
		},
		birthday: {
			day: {type: Number, min: 1, max: 31, required: false},
			month: {type: Number, min: 1, max: 12, required: false},
			year: {type: Number},
		},
		photoUrl : {type: String},
		biography : {type: String},
		status: [Status], // the account's own status updates
		activity: [Status] // all status updates, including friends
	});

	var Conta = mongoose.model('Conta', EsquemaDeConta);

	var callbackRegisto = function(err) {
		if(err) {
			return console.log(err);
		}
		return console.log('Account was created');
	};

	var mudarPassword = function(accountId, newpassword) {
		var shaSum = crypto.createHash('sha256');
		shaSum.update(newpassword);
		var hashedPassword = shaSum.digest('hex');
		Conta.update({_id:accountId}, {$set: {password: hashedPassword}}, {upsert: false}, function callbackMudarPassword(err) {
			console.log('Change password done for account ' + accountId);
		});
	};

	var esqueciPassword = function(email, resetPasswordUrl, callback) {
		var user = Conta.findOne({email: email}, function findAccount(err, doc) {
			if(err) {
				// Email address is not a valid user
				callback(false);
			} else {
				var smtpTransport = nodemailer.createTransport('SMTP', config.mail);
				resetPasswordUrl += '?account=' + doc._id;
				smtpTransport.sendMail({
					from: 'thisapp@example.com',
					to: doc.email,
					subject: 'SocialNet Password Request',
					text: 'Click here to reset your password: ' + resetPasswordUrl
				}, function forgotPasswordResult(err) {
					if(err) {
						callback(false);
					} else {
						callback(true);
					}
				});
			}
		});
	};

	var entrar = function(email, password, callback) {
		var shaSum = crypto.createHash('sha256');
		shaSum.update(password);

		Conta.findOne({email: email, password: shaSum.digest('hex')}, function(err, doc) {
			callback(doc);
		});
	};

	var registar = function(email, password, firstName, lastName) {
		var shaSum = crypto.createHash('sha256');
		shaSum.update(password);

		console.log('Registering ' +  email);
		var user = new Conta({
			email: email,
			name: {
				first: firstName,
				last: lastName
			},
			password: shaSum.digest('hex')
		});
		user.save(callbackRegisto);
		console.log('Save command was sent');
	};

	var encontrarPorId = function(accountId, callback) {
		Conta.findOne({_id: accountId}, function(err, doc) {
			callback(doc);
		});
	};

	return {
		registar: registar,
		esqueciPassword: esqueciPassword,
		mudarPassword: mudarPassword,
		entrar: entrar,
		encontrarPorId: encontrarPorId,
		Conta: Conta
	};
}