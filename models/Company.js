const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CompanySchema = new Schema({
	name: { type: String, required: true },
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
});

module.exports = mongoose.model('Company', CompanySchema);