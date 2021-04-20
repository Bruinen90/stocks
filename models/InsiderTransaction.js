const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const InsiderTransactionSchema = new Schema({
	company: { type: Schema.Types.ObjectId, ref: 'Company' },
	transactionType: String,
	date: Date,
	volumen: Number,
	closingPrice: Number,
	pdfLink: String,
	identifier: String,
});

module.exports = mongoose.model('InsiderTransaction', InsiderTransactionSchema);
