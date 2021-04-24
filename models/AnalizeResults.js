const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ResultSchema = new Schema({
	endChange: Number,
	max: Number,
	min: Number,
});

const AnalizeResultsSchema = new Schema({
	oneMonth: ResultSchema,
	threeMonths: ResultSchema,
	// sixMonths: ResultSchema,
	// oneYear: ResultSchema,
});

const AnalizeResults = mongoose.model('AnalizeResults', AnalizeResultsSchema);

module.exports = AnalizeResultsSchema;
