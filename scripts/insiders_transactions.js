const Crawler = require("crawler");
const opn = require("open");
const excel = require("excel4node");
const googleIt = require("google-it");

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
			const links = $("td.wrap-line").children().toArray();
			const pageLinks = links
				.map((anchor, i) => {
					const matchingHeader = anchor.children.filter(
						(child) =>
							child.data &&
							!child.data.includes("\n") &&
							child.data.toLowerCase().includes("transakc")
					);
					if (matchingHeader.length > 0) {
						return matchingHeader[0].parent.attribs.href;
					}
				})
				.filter((anchor) => anchor !== undefined);
			// const worksheet = workbook.addWorksheet(`Day ${sheetNumber}`);
			const uniqueLinks = [...new Set(pageLinks)];
			uniqueLinks.forEach((link, index) => {
				if (index < 2) {
					// opn(link);
					const insideCrawler = new Crawler({
						callback: (errorI, resI, doneI) => {
							if (errorI) {
								console.log(errorI);
							} else {
								const $I = resI.$;
								// Download PDF File
								const pdfLink = $I("tr.dane>td>li>a").prop(
									"href"
								);
								opn(
									"http://infostrefa.com/espi/pl/reports/view/" +
										pdfLink
								);
								// Get company name
								const companyName = $I(
									"div.dane>table>tr>td>span.bold"
								).toArray()[2].children[0].data;
								console.log(companyName);
								// Get date
								const date = $I(
									"div.dane>table>tr>td>span.bold"
								).toArray()[1].children[0].data;
								console.log(date);
								doneI();
								// Find company in google
								googleIt({ query: `${companyName} bankier` })
									.then((results) => {
										// access to results object here
										opn(results[0].link);
									})
									.catch((e) => {
										// any possible errors that might have occurred (like no Internet connection)
									});
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

for (let a = 15; a <= 15; a++) {
	days.push(
		`http://infostrefa.com/infostrefa/pl/raporty/espi/biezace,2021,4,${a},2`
	);
}

c.queue(days);
