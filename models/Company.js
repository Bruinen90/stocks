const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CompanySchema = new Schema({
	name: { type: String, required: true },
	nip: Number,
	data: {
		type: [
			{
				date: Date,
				name: String,
				closePrice: Number | String,
				change: Number | String,
				openPrice: Number | String,
				minPrice: Number | String,
				maxPrice: Number | String,
				dealsInPLN: Number | String,
				updateDate: Date,
			},
		],
		required: true,
	},
	insidersTransactions: {
		type: [
			{
				transactionType: String,
				date: Date,
				volumen: Number,
				closingPrice: Number,
				pdfLink: String,
				identifier: { type: String, unique: true, dropDups: true },
			},
		],
		required: false,
	},
});

module.exports = mongoose.model('Company', CompanySchema);
