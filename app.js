const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();

// Graphql
const { graphqlHTTP } = require('express-graphql');
const graphqlSchema = require('./graphql/schema');
const graphqlResolver = require('./graphql/root_resolver');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader(
		'Access-Control-Allow-Methods',
		'GET, POST, PUT, PATCH, DELETE'
	);
	res.setHeader('Access-Control-Allow-Headers', '*');
	if (req.method === 'OPTIONS') {
		return res.sendStatus(200);
	}
	next();
});

app.use(
	'/graphql',
	graphqlHTTP({
		schema: graphqlSchema,
		rootValue: graphqlResolver,
		graphiql: true,
	})
);

for (let i = 26; i <= 31; i++) {
	let day = i;
	if (day < 10) {
		day = '0' + day;
	}
	graphqlResolver.updateCompaniesData({ date: `2019-10-${day}` });
}

// graphqlResolver.addCompaniesNipNumbers();

// graphqlResolver.getCompanyData({
// 	companyName: '11 bit studios SA',
// 	date: '2021-03-02',
// });

// graphqlResolver.analizeTransactions();

const spinnUp = async () => {
	try {
		await mongoose.connect(
			`mongodb+srv://bruinen:${process.env.MONGO_PASSWORD}@nodecourse-wx0jk.gcp.mongodb.net/stock`,
			{
				useNewUrlParser: true,
				useUnifiedTopology: true,
			}
		);
		app.listen(process.env.PORT || 8080);
	} catch (error) {
		console.log(error);
	}
};

spinnUp();
