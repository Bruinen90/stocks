const Crawler = require('crawler');
const axios = require('axios');
const opn = require('open');
const excel = require('excel4node');
const googleIt = require('google-it');

let sheetNumber = 1;

const c = new Crawler({
	timeout: 999999,
	maxConnections: 30,
	callback: (error, res, done) => {
		// const workbook = new excel.Workbook();
		if (error) {
			console.log(error);
		} else {
			const $ = res.$;
			// $ is Cheerio by default
			//a lean implementation of core jQuery designed specifically for the server
			const links = $('td.wrap-line')
				.children()
				.toArray();
			const pageLinks = links
				.map((anchor, i) => {
					const matchingHeader = anchor.children.filter(
						child =>
							child.data &&
							!child.data.includes('\n') &&
							child.data.toLowerCase().includes('transakc')
					);
					if (matchingHeader.length > 0) {
						return matchingHeader[0].parent.attribs.href;
					}
				})
				.filter(anchor => anchor !== undefined);
			// const worksheet = workbook.addWorksheet(`Day ${sheetNumber}`);
			const uniqueLinks = [...new Set(pageLinks)];
			uniqueLinks.forEach((link, index) => {
				if (index < 2) {
					// opn(link);
					const insideCrawler = new Crawler({
						callback: async (errorI, resI, doneI) => {
							if (errorI) {
								console.log(errorI);
							} else {
								const $I = resI.$;
								// Download PDF File
								let pdfLink = $I('tr.dane>td>li>a').prop(
									'href'
								);
								pdfLink =
									'http://infostrefa.com/espi/pl/reports/view/' +
									pdfLink;
								// Get company name
								let companyName = $I(
									'div.dane>table>tr>td>span.bold'
								).toArray()[2].children[0].data;
								// Get date
								const date = $I(
									'div.dane>table>tr>td>span.bold'
								).toArray()[1].children[0].data;

								// Get NIP
								const nip = $I('html').html();
								if (nip) {
									const re = /\d{3}\s\d{3}\s\d{2}\s\d{2}/gi;
									if (!nip.match(re)) {
										opn(link);
									}
									console.log(
										nip.match(re)
										// nip.match(re)[0].replace(/\s/g, '');
									);
								} else {
									console.log('No NIP');
								}
								// console.log(nip);

								// try {
								// 	const googleResponse = await googleIt({
								// 		query: `${companyName} infosfera`,
								// 	});
								// 	companyName = googleResponse[0].title.split(
								// 		' - Infostrefa'
								// 	)[0];
								// 	console.log(companyName);
								// 	const graphqlQuery = {
								// 		query: `
								//             mutation{postInsidersTransaction(data: {companyName: "${companyName}", date: "${date}"}) {result}}
								//         `,
								// 	};
								// 	const response = await axios.post(
								// 		'http://localhost:8080/graphql',
								// 		graphqlQuery
								// 	);
								// 	console.log(response.data);
								// } catch (err) {
								// 	console.log(err.response.data);
								// }
								doneI();
							}
						},
					});
					insideCrawler.queue(link);
				}
				// worksheet.cell(index + 1, 1).string(link);
			});
			// workbook.write(`dane${sheetNumber}.xlsx`);

			// links.forEach((link) => opn(link));
		}
		done = () => {
			sheetNumber = sheetNumber + 1;
		};
		done();
	},
});

const days = [];

for (let a = 1; a <= 3; a++) {
	days.push(
		`http://infostrefa.com/infostrefa/pl/raporty/espi/biezace,2021,3,${a},1`
	);
}

c.queue(days);
