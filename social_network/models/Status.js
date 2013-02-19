module.exports = function(config, mongoose) {

	var StatusSchema = new mongoose.Schema({
		status: {type: String},
	});

	var Status = mongoose.model('Status', StatusSchema);

	return {
		Status: Status
	};
};