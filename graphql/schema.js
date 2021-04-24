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

    type Company {
        name: String
	    nip: Int
        data: [DailyCompanyData]
    }

    type InsidersTransaction {
        _id: ID!
        company: Company
        type: String
        date: String!
        volumen: Float
        pdfLink: String!
    }

    type InsidersTransactions {
        transactions: [InsidersTransaction]
    }

    type SuccessResult {
        result: Boolean!
    }

    input CompanyDataInput {
        name: String
        date: String
    }

    input InsidersTransactionInput {
        nip: String!
        date: String!
        identifier: String!
        pdfLink: String!
        type: String
        volumen: Float
    }

    input TransactionTypeInput {
        transactionId: ID!
        type: String!
    }

    type RootMutation {
        postInsidersTransaction(data: InsidersTransactionInput): SuccessResult
        setTransactionType(data: TransactionTypeInput): SuccessResult
    }

    type RootQuery {
        getDailyData(data: CompanyDataInput): DailyCompanyData
        getInsidersTransactions: InsidersTransactions
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);
