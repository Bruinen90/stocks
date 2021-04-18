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

    type InsidersTransaction {
        type: String
        date: String!
        volumen: Float
        closingPrice: Float
    }

    type SuccessResult {
        result: Boolean!
    }

    input CompanyDataInput {
        name: String
        date: String
    }

    input InsidersTransactionInput {
        companyName: String!
        type: String
        date: String!
        volumen: Float
    }

    type RootMutation {
        postInsidersTransaction(data: InsidersTransactionInput): SuccessResult
    }

    type RootQuery {
        getDailyData(data: CompanyDataInput): DailyCompanyData
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);
