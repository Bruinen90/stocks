// Models
const Company = require('../../models/Company');
const InsiderTransaction = require('../../models/InsiderTransaction');

// Crawler
const Crawler = require('crawler');

const { analizeEffects } = require('./analize');

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

			const duplicate = await InsiderTransaction.findOne({
				identifier: identifier,
				pdfLink: pdfLink,
			});
			if (duplicate) {
				console.log('Transaction already in DB, adding aborted');
				return { result: false };
			}

			const newInsiderTransaction = new InsiderTransaction(
				newTransactionData
			);
			await newInsiderTransaction.save();
			console.log(
				'Properly saved transaction',
				newInsiderTransaction._id
			);

			return { result: true };
		} else {
			console.log('NO COMPANY FOUND FOR NIP: ', nip);
			return { result: false };
		}
	},
	getInsidersTransactions: async (_, req) => {
		try {
			const companiesWithInsidersTransactions = await InsiderTransaction.find().populate(
				'company'
			);
			return { transactions: companiesWithInsidersTransactions };
		} catch (err) {
			console.log(err);
		}
	},
	analizeTransactions: async (_, req) => {
		try {
			const allTransactions = await InsiderTransaction.find();
			allTransactions
				.filter(transaction => !transaction.analizeResults)
				.forEach(async transaction => {
					const analizeEffect = await analizeEffects({
						companyId: transaction.company,
						baseDate: transaction.date,
					});
					transaction.analizeResults = { ...analizeEffect };
					await transaction.save();
				});
		} catch (err) {
			console.log(err);
		}
	},
	setTransactionType: async (_, req) => {
		try {
			console.log(req);
			const { transactionId, type } = req.data;
			if (type === 'toBeRemoved') {
				await InsiderTransaction.findOneAndRemove({
					_id: transactionId,
				});
				return { result: true };
			} else {
				const transaction = await InsiderTransaction.findById(
					transactionId
				);
				if (!transaction) {
					console.log('No transaction found for ID: ', transactionId);
					return { result: false };
				} else {
					transaction.type = type;
					await transaction.save();
					return { result: true };
				}
			}
		} catch (err) {
			console.log(err);
		}
	},
};
