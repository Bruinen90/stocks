const Company = require("../../models/Company");

const addMonths = ({ date, monthsCount }) => {
    const updatedDate = new Date(date.setMonth(date.getMonth() + monthsCount));
    return updatedDate;
};

const calculateReturn = ({ base, effect }) => {
    return ((effect - base) / base) * 100;
};

const findExtreams = ({ filteredArr }) => {
    const minCourses = filteredArr
        .map((day) => day.minPrice)
        .sort((a, b) => a - b);
    const maxCourses = filteredArr
        .map((day) => day.maxPrice)
        .sort((a, b) => a - b);
    const min = minCourses[0];
    const max = maxCourses[minCourses.length - 1];
    return { min, max };
};

const analizeForXMonths = ({ startDate, dataArray, monthsCount }) => {
    const endDate = addMonths({ date: startDate, monthsCount });
    const filteredArr = dataArray.filter(
        (day) => day.date >= startDate && day.date <= endDate
    );
    const basePrice = filteredArr[0].closePrice;
    const { min, max } = findExtreams({ filteredArr });
    return {
        endReturn: calculateReturn({
            base: basePrice,
            effect: filteredArr[filteredArr.length - 1],
        }),
        min: calculateReturn({ base: basePrice, effect: min }),
        max: calculateReturn({ base: basePrice, effect: max }),
    };
};

module.exports = {
    analizeEffects: async ({ companyId, baseDate }) => {
        const company = await Company.findById(companyId);
        if (!company) {
            console.log("No company found for data: ", companyId);
        } else {
            console.log(
                analizeForXMonths({
                    startDate: new Date(baseDate),
                    dataArray: company.data,
                    monthsCount: 1,
                })
            );
        }
    },
};
