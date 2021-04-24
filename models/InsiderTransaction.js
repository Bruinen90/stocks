const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AnalizeResultsSchema = require('./AnalizeResults');

const InsiderTransactionSchema = new Schema({
	company: { type: Schema.Types.ObjectId, ref: 'Company' },
	type: String,
	date: Date,
	volumen: Number,
	pdfLink: String,
	identifier: String,
	analizeResults: AnalizeResultsSchema,
});

module.exports = mongoose.model('InsiderTransaction', InsiderTransactionSchema);
