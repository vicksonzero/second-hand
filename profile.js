
const yaml = require('js-yaml');
const fs = require('fs');
var profile;

try {
	var doc = yaml.safeLoad(fs.readFileSync(`${__dirname}/profile.yml`, 'utf8'));
	console.log(doc);
	profile = doc;
} catch (e) {
	console.log(e);
}

module.exports = profile;
