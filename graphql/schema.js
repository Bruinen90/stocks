const { buildSchema } = require('graphql');

module.exports = buildSchema(`
    type DailyCompanyData {
        closePrice: Float
		change: Float
		openPrice: Float
		minPrice: Float
		maxPrice: Float
		dealsInPLN: Int
		updateDate: String
    }

    type CompanyDataInput {
        name: String
        date: String
        closePrice: Float
    }

    type RootQuery {
        getDailyData(data: CompanyDataInput): DailyCompanyData
    }
`);
