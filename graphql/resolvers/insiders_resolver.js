// Models
const Company = require('../../models/Company');

// Crawler
const Crawler = require('crawler');

module.exports = {
	postInsidersTransaction: async ({ data }, req) => {
		const { nip, type, date, identifier, pdfLink, volumen } = data;
		const foundCompany = await Company.findOne({ nip: nip });
		if (foundCompany) {
			const newTransactionData = {
				date,
				identifier,
				pdfLink,
				type,
				volumen,
			};
			if (
				!foundCompany.insidersTransactions ||
				!foundCompany.insidersTransactions.length > 0
			) {
				foundCompany.insidersTransactions = [];
			}

			const updatedTransaction = await Company.findOneAndUpdate(
				{
					nip: nip,
					'insidersTransactions.identifier': identifier,
				},
				{
					$set: {
						'insidersTransactions.$.date': date,
						'insidersTransactions.$.pdfLink': pdfLink,
						'insidersTransactions.$.type': type,
						'insidersTransactions.$.volumen': volumen,
					},
				}
			);
			if (!updatedTransaction) {
				foundCompany.insidersTransactions.push(newTransactionData);
				const newRecord = await foundCompany.save();
				console.log(newRecord.insidersTransactions);
			}
			return { result: true };
		} else {
			console.log('NO COMPANY FOUND FOR NIP: ', nip);
			return { result: false };
		}
	},
	getInsidersTransactions: async (_, req) => {
		const companiesWithInsidersTransactions = await Company.find({
			'insidersTransactions.0': { $exists: true },
		});
		console.log(
			companiesWithInsidersTransactions.map(company =>
				company.insidersTransactions.map()
			)
		);
	},
};
