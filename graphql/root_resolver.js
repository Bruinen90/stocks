const companyResolver = require('./resolvers/companies_resolver');
const insidersResolver = require('./resolvers/insiders_resolver');
const analizeResolver = require('./resolvers/analize');

module.exports = {
	...companyResolver,
	...insidersResolver,
	...analizeResolver,
};
