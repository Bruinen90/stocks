const Crawler = require('crawler');

const RECIEVED_DATE = '2021-04-01';

const findNumber = rowDiv => {
	return parseFloat(rowDiv.children[0].children[0].data.replace(',', '.'));
};

const getDailyData = (date = RECIEVED_DATE) => {
	let data;
	const eodCrawler = new Crawler({
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
					const nameParentDiv = rowDivs[0].children[0].children[0];
					if (nameParentDiv.children) {
						companyName = nameParentDiv.children[0].data;
					} else {
						companyName = nameParentDiv.data;
					}
					// Other data
					const closePrice = parseFloat(
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
					return {
						name: companyName,
						closePrice,
						change,
						openPrice,
						minPrice,
						maxPrice,
						dealsInPLN,
					};
				});
				data = mappedCompanies;
				done();
			}
		},
	});

	eodCrawler.queue(`https://www.money.pl/gielda/spolki-gpw/?date=${date}`);
	console.log('Partly done');
	eodCrawler.on('drain', () => {
		console.log('UPDATING DAILY DATA DONE');
	});
	return eodCrawler;
};

module.exports = getDailyData;
