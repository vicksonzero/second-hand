
const yaml = require('js-yaml');
const fs = require('fs');
var profile;

try {
	var rawData = yaml.safeLoad(fs.readFileSync(`${__dirname}/profile.yml`, 'utf8'));
	console.log(rawData);
	profile = createProfile(rawData);
	profile.rawData = rawData;
} catch (e) {
	console.log(e);
}

function createProfile(rawData) {
	let result = JSON.parse(JSON.stringify(rawData));

	let defaultStyle = result.styles.find(function (style) {
		return style.name == "default";
	});
	result.styles = result.styles.map(function (style) {
		if(style.name == "default") return style;
		let parsedStyle = Object.assign({}, defaultStyle, style);
		return parsedStyle;
	});

	result.styleByName = {};
	result.styles.forEach(function (style) {
		result.styleByName[style.name] = style;
	})

	if(typeof result.defaultStyle === "string"){
		result.defaultStyle = result.styleByName[result.defaultStyle];
	}

	console.log(result);
	return result;
}

module.exports = profile;
