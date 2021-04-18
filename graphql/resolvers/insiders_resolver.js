// Models
const Company = require('../../models/Company');

// Crawler
const Crawler = require('crawler');

module.exports = {
	postInsidersTransaction: async ({ data }, req) => {
		const { companyName, type, date } = data;
		const foundCompany = await Company.findOne({ name: companyName });
		if (foundCompany) {
			console.log(
				'ADDING INSIDER TRANSACTION TO COMPANY',
				foundCompany.name
			);
			if (
				!foundCompany.insidersTransactions ||
				!foundCompany.insidersTransactions.length > 0
			) {
				foundCompany.insidersTransactions = [];
			}
			foundCompany.insidersTransactions.push({
				transactionType: type,
				date: new Date(date),
			});
			const newRecord = await foundCompany.save();
			console.log(newRecord);
		} else {
			console.log('NO COMPANY FOUND FOR NAME: ', companyName);
		}
	},
};
