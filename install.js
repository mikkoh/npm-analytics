var path = require('path');
var fs = require('fs');
var pathSplit;
var pathHooks;
var pathInstall;
var pathAnalytics;

// we are not a dep of a dep
if(!module.parent) {
	pathSplit = __dirname.split('node_modules');
	pathHooks = path.join(pathSplit[0], 'node_modules', '.hooks');
	pathInstall = path.join(pathHooks, 'install');
	pathAnalytics = path.join(__dirname, 'analytics.js');

	// check if hooks exists
	if(!fs.existsSync(pathHooks)) {
		fs.mkdirSync(pathHooks);
	}

	// no install script exists
	if(!fs.existsSync(pathInstall)) {

		fs.createReadStream(pathAnalytics)
		.pipe(fs.createWriteStream(pathInstall, {
			mode: '0755'
		}));
		
	} else {

		// TODO: Handle this properly
		throw new Error('there is already a .hooks/install script in node_modules');
	}	
}