const axios = require('axios');

const getCompanyData = async () => {
	try {
		const graphqlQuery = {
			query: `{
                getDailyData(data: {name: "11 bit studios SA", date: "2021-03-10"}) {
                    closePrice
                    change
                    openPrice
                    minPrice
                    maxPrice
                    dealsInPLN
                    updateDate
                }
            }`,
		};
		const response = await axios.post(
			'http://localhost:8080/graphql',
			graphqlQuery
		);
		console.log(response.data);
	} catch (err) {
		console.log(err.response.data);
	}
};

// getCompanyData();

const newInsiderTransaction = async () => {
	try {
		const graphqlQuery = {
			query: `
                mutation{postInsidersTransaction(data: {companyName: "11 bit studios SA", type: "buy", date: "2021-03-10"}) {result}}
            `,
		};
		const response = await axios.post(
			'http://localhost:8080/graphql',
			graphqlQuery
		);
		console.log(response.data);
	} catch (err) {
		console.log(err.response.data);
	}
};

newInsiderTransaction();
