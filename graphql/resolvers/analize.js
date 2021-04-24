const Company = require('../../models/Company');

const addMonths = ({ date, monthsCount }) => {
	const newDate = new Date(date.getTime());
	const updatedDate = new Date(
		newDate.setMonth(newDate.getMonth() + monthsCount)
	);
	return updatedDate;
};

const calculateReturn = ({ base, effect }) => {
	return ((effect - base) / base) * 100;
};

const findExtreams = ({ filteredArr }) => {
	const minCourses = filteredArr
		.map(day => day.minPrice)
		.sort((a, b) => a - b);
	const maxCourses = filteredArr
		.map(day => day.maxPrice)
		.sort((a, b) => b - a);
	const min = minCourses[0];
	const max = maxCourses[0];
	return { min, max };
};

const analizeForXMonths = ({ startDate, dataArray, monthsCount }) => {
	const endDate = addMonths({ date: startDate, monthsCount });
	const filteredArr = dataArray.filter(
		day => day.date >= startDate && day.date <= endDate
	);
	const basePrice = filteredArr[0].closePrice;
	const { min, max } = findExtreams({ filteredArr });
	return {
		endChange: calculateReturn({
			base: basePrice,
			effect: filteredArr[filteredArr.length - 1].closePrice,
		}),
		min: calculateReturn({ base: basePrice, effect: min }),
		max: calculateReturn({ base: basePrice, effect: max }),
	};
};

module.exports = {
	analizeEffects: async ({ companyId, baseDate }) => {
		try {
			const company = await Company.findById(companyId);
			if (!company) {
				console.log('No company found for data: ', companyId);
			} else {
				return {
					oneMonth: analizeForXMonths({
						startDate: new Date(baseDate),
						dataArray: company.data,
						monthsCount: 1,
					}),
					threeMonths: analizeForXMonths({
						startDate: new Date(baseDate),
						dataArray: company.data,
						monthsCount: 3,
					}),
					// sixMonths: analizeForXMonths({
					// 	startDate: new Date(baseDate),
					// 	dataArray: company.data,
					// 	monthsCount: 6,
					// }),
					// oneYear: analizeForXMonths({
					// 	startDate: new Date(baseDate),
					// 	dataArray: company.data,
					// 	monthsCount: 12,
					// }),
				};
			}
		} catch (err) {
			console.log(err);
		}
	},
};
