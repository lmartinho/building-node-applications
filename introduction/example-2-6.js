var events = require('events');
var eventEmitter = new events.EventEmitter();

function mainLoop() {
	console.log('Starting application');
	eventEmitter.emit('ApplicationStart');

	console.log('Running application');
	eventEmitter.emit('ApplicationRun');

	console.log('Stopping application');
	eventEmitter.emit('ApplicationStop');
}

function onApplicationStart() {
	console.log('Handling Application Start');
}

function onApplicationRun() {
	console.log('Handling Application Run');
}

function onApplicationStop() {
	console.log('Handling Application Stop');
}

eventEmitter.on('ApplicationStart', onApplicationStart);
eventEmitter.on('ApplicationRun', onApplicationRun);
eventEmitter.on('ApplicationStop', onApplicationStop);

mainLoop();