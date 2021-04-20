const Crawler = require('crawler');
const axios = require('axios');
const opn = require('open');

const c = new Crawler({
	timeout: 999999,
	maxConnections: 30,
	callback: (error, res, done) => {
		if (error) {
			console.log(error);
		} else {
			const $ = res.$;
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
			const uniqueLinks = [...new Set(pageLinks)];
			uniqueLinks.forEach((link, index) => {
				if (index < 2) {
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
								if (!pdfLink) {
									pdfLink = link;
								} else {
									pdfLink =
										'http://infostrefa.com/espi/pl/reports/view/' +
										pdfLink;
								}
								// Get company name
								let companyName = $I(
									'div.dane>table>tr>td>span.bold'
								).toArray()[2].children[0].data;
								// Get date
								const date = $I(
									'div.dane>table>tr>td>span.bold'
								).toArray()[1].children[0].data;

								// Get NIP
								const html = $I('html').html();
								let nip;
								if (html) {
									const regex = /<td>NIP<\/td>\s*<td>(.*)<\/td>/;
									nip = html.match(regex)[1];
									if (!nip) {
										opn(link);
									}
									nip = nip.replace(/\D/g, '');
									console.log('NIP: ', nip);
								} else {
									console.log('No NIP for ', link);
									opn(link);
								}

								// Get transaction identifier
								let identifier;
								if (html) {
									const regex = /<td>Identyfikator raportu<\/td>\s*<td>(.*)<\/td>/;
									identifier = html.match(regex)[1];
									if (!identifier) {
										console.log(
											'No transaction identifier for ',
											link
										);
										opn(link);
									}
									// console.log('IDENTIFIER: ', identifier);
								}
								console.log(pdfLink);
								try {
									const graphqlQuery = {
										query: `
								            mutation{postInsidersTransaction(data: {nip: "${nip}", date: "${date}", identifier: "${identifier}", pdfLink: "${pdfLink}"}) {result}}
								        `,
									};
									const response = await axios.post(
										'http://localhost:8080/graphql',
										graphqlQuery
									);
									console.log(response.data);
								} catch (err) {
									console.log(err);
								}
								doneI();
							}
						},
					});
					insideCrawler.queue(link);
				}
			});
		}
		done();
	},
});

const days = [];

for (let a = 1; a <= 3; a++) {
	days.push(
		`http://infostrefa.com/infostrefa/pl/raporty/espi/biezace,2021,3,${a},3`
	);
}

c.queue(days);
