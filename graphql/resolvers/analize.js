const Company = require('../../models/Company');

const addMonths = ({ date, monthsCount }) => {
	const updatedDate = new Date(date.setMonth(date.getMonth() + monthsCount));
	return updatedDate;
};

const calculateReturn = ({ start, end }) => {
	return ((end.closePrice - start.closePrice) / start.closePrice) * 100;
};

const findExtreams = ({ array, startDate, endDate }) => {
	const filteredArr = array.filter(
		day => day.date > startDate && day.date <= endDate
	);
	const minCourses = filteredArr
		.map(day => day.minPrice)
		.sort((a, b) => a - b);
	const maxCourses = filteredArr
		.map(day => day.maxPrice)
		.sort((a, b) => a - b);
	const min = minCourses[0];
	const max = maxCourses[minCourses.length - 1];
	return { min, max };
};

module.exports = {
	analizeEffects: async ({ companyId, baseDate }) => {
		const company = await Company.findById(companyId);
		if (!company) {
			console.log('No company found for data: ', companyId);
		} else {
			const basicDate = company.data.find(
				day => day.date.toString() === new Date(baseDate).toString()
			);
			const plusOneMonthData = company.data.find(
				day =>
					day.date.toString() ===
					addMonths({
						monthsCount: 1,
						date: new Date(baseDate),
					}).toString()
			);
			const oneMonthExreams = findExtreams({
				array: company.data,
				startDate: new Date(baseDate),
				endDate: addMonths({
					monthsCount: 1,
					date: new Date(baseDate),
				}),
			});
			console.log(oneMonthExreams);
			console.log(
				(oneMonthExreams.min - basicDate.closePrice) /
					basicDate.closePrice
			);
			console.log(
				calculateReturn({ start: basicDate, end: plusOneMonthData })
			);
		}
	},
};
