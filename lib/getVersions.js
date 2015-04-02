var promise = require('bluebird');
var version = require('version');

module.exports = function(modules) {
	
	var rVal = {};
	var numChecked = 0;

	return new promise( function(ok, bad) {

		if(modules.length > 0) {
			modules.forEach(function(moduleName) {

				if(moduleName.charAt(0) != '.') {

					version.fetch(moduleName, function(err, version) {

						numChecked++;

						if(!err) {
							rVal[ moduleName ] = version;	
						}

						if(numChecked == modules.length) {
							ok(rVal);
						}
					});
				} else {

					numChecked++;
				}
			});
		} else {

			ok(rVal);
		}
	});
};