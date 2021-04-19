// Models
const Company = require('../../models/Company');

// Crawler
const Crawler = require('crawler');
const googleIt = require('google-it');

module.exports = {
	updateCompaniesData: async ({ date }, req) => {
		const findNumber = rowDiv => {
			return parseFloat(
				rowDiv.children[0].children[0].data.replace(',', '.')
			);
		};

		let data;
		const eodCrawler = new Crawler({
			timeout: 999999,
			maxConnections: 30,
			callback: (err, res, done) => {
				if (err) {
					console.log(err);
				} else {
					const $ = res.$;
					const allCompanies = $('div.rt-tr-group').toArray();
					const mappedCompanies = allCompanies.map(data => {
						const rowDivs = data.children[0].children;
						// Company name
						let companyName = '';
						const nameParentDiv =
							rowDivs[0].children[0].children[0];
						if (nameParentDiv.children) {
							companyName = nameParentDiv.children[0].data;
						} else {
							companyName = nameParentDiv.data;
						}
						// Other data
						closePrice = parseFloat(
							rowDivs[1].children[0].children[0].data.replace(
								',',
								'.'
							)
						);
						const change = parseFloat(
							rowDivs[2].children[0].children[0].data
								.replace(',', '.')
								.replace('+', '')
						);
						const openPrice = findNumber(rowDivs[3]);
						const minPrice = findNumber(rowDivs[4]);
						const maxPrice = findNumber(rowDivs[5]);
						const dealsInPLN = parseInt(
							rowDivs[7].children[0].children[0].data.replace(
								/\s/g,
								''
							)
						);
						const updateDate =
							rowDivs[8].children[0].children[0].data;
						return {
							name: companyName,
							closePrice,
							change,
							openPrice,
							minPrice,
							maxPrice,
							dealsInPLN,
							updateDate,
						};
					});
					data = mappedCompanies;
					done();
				}
			},
		});

		eodCrawler.queue(
			`https://www.money.pl/gielda/spolki-gpw/?date=${date}`
		);
		eodCrawler.on('drain', () => {
			try {
				data.forEach(async company => {
					const {
						name,
						closePrice,
						change,
						openPrice,
						minPrice,
						maxPrice,
						dealsInPLN,
						updateDate,
					} = company;
					const newData = {
						date,
						closePrice,
						change,
						openPrice,
						minPrice,
						maxPrice,
						dealsInPLN,
						updateDate,
					};
					const companyAlreadyInDb = await Company.findOne({
						name: name,
					});
					if (companyAlreadyInDb) {
						const existingDay = companyAlreadyInDb.data.find(
							day =>
								day.date.toString() ===
								new Date(date).toString()
						);
						if (existingDay) {
							console.log('day already in db');
						} else {
							companyAlreadyInDb.data.push(newData);
							await companyAlreadyInDb.save();
						}
					} else {
						const createdCompany = new Company({
							name,
							data: [newData],
						});
						const newCompany = await createdCompany.save();
						console.log('NEW COMPANY ADDED', newCompany);
					}
				});
			} catch (err) {
				console.log(err);
			}
		});
	},
	getDailyData: async ({ data }, req) => {
		console.log(data);
		const { name, date } = data;
		const companyFound = await Company.findOne({ name: name });
		if (companyFound) {
			console.log('FOUND', companyFound);
			const responseData = companyFound.data.find(data => {
				return data.date.toString() === new Date(date).toString();
			});
			return responseData;
		}
	},
	addCompaniesNipNumbers: async (_, req) => {
		try {
			const allCompanies = await Company.find();
			allCompanies.forEach(async company => {
				try {
					if (!company.nip) {
						const googleResponse = await googleIt({
							options: {
								noDisplay: true,
							},
							query: `${company.name} nip`,
						});
						const regex = /NIP\s(\d*),\s./;
						const nip = googleResponse
							.map(response => response.snippet)
							.join(' ')
							.match(regex);
						if (nip && nip[1]) {
							company.nip = parseInt(nip[1]);
							await company.save();
						} else {
							console.log(
								'NIP NOT FOUND for comapny ',
								company.name
							);
						}
					}
				} catch (err) {
					console.log(err);
				}
			});
		} catch (err) {
			console.log(err);
		}
	},
};
