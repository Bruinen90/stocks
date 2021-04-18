const companyResolver = require('./resolvers/companies_resolver');
const insidersResolver = require('./resolvers/insiders_resolver');

module.exports = {
	...companyResolver,
	...insidersResolver,
};
