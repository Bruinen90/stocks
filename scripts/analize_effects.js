const Company = require('../models/Company');

const addMonths = ({ date, monthsCount }) =>
	new Date(date.setMonth(date.getMonth() + monthsCount));

const analizeEffects = async ({ companyId, baseDate }) => {
	const date = new Date(baseDate);

	try {
		const company = await Company.findById(companyId);
		console.log(company);
	} catch (err) {
		console.log(err);
	}

	// if (!baseDateData) {
	// 	console.log(
	// 		'No company found for data: ',
	// 		companyId,
	// 		new Date(baseDate)
	// 	);
	// } else {
	// 	const plusOneMonthData = await Company.findOne({
	// 		_id: companyId,
	// 		data: { date: addMonths({ monthsCount: 1, date }) },
	// 	});
	// 	console.log(plusOneMonthData);
	// }
};

analizeEffects({
	companyId: '607b0923fdd08c3d685ecd10',
	baseDate: '2019-01-03',
});
