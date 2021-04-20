// Models
const Company = require('../../models/Company');
const InsiderTransaction = require('../../models/InsiderTransaction');

// Crawler
const Crawler = require('crawler');

module.exports = {
	postInsidersTransaction: async ({ data }, req) => {
		const { nip, type, date, identifier, pdfLink, volumen } = data;
		const foundCompany = await Company.findOne({ nip: nip });
		if (foundCompany) {
			const newTransactionData = {
				company: foundCompany._id,
				date,
				identifier,
				pdfLink,
				type,
				volumen,
			};

			const newInsiderTransaction = new InsiderTransaction(
				newTransactionData
			);
			await newInsiderTransaction.save();
			console.log(
				'Properly saved transaction',
				newInsiderTransaction._id
			);
			// if (
			// 	!foundCompany.insidersTransactions ||
			// 	!foundCompany.insidersTransactions.length > 0
			// ) {
			// 	foundCompany.insidersTransactions = [];
			// }

			// const updatedTransaction = await Company.findOneAndUpdate(
			// 	{
			// 		nip: nip,
			// 		'insidersTransactions.identifier': identifier,
			// 	},
			// 	{
			// 		$set: {
			// 			'insidersTransactions.$.date': date,
			// 			'insidersTransactions.$.pdfLink': pdfLink,
			// 			'insidersTransactions.$.type': type,
			// 			'insidersTransactions.$.volumen': volumen,
			// 		},
			// 	}
			// );
			// if (!updatedTransaction) {
			// 	foundCompany.insidersTransactions.push(newTransactionData);
			// 	const newRecord = await foundCompany.save();
			// 	console.log(newRecord.insidersTransactions);
			// }
			return { result: true };
		} else {
			console.log('NO COMPANY FOUND FOR NIP: ', nip);
			return { result: false };
		}
	},
	getInsidersTransactions: async (_, req) => {
		const companiesWithInsidersTransactions = await InsiderTransaction.find().populate(
			'company'
		);
		console.log(companiesWithInsidersTransactions);
	},
};
