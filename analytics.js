#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var RELATIVE = global.__base = path.resolve(__dirname, path.join('..', 'npm-analytics'));
var NODE_MODULES = path.resolve(__dirname, path.join('..', 'npm-analytics', 'node_modules'));
var BASE_DIR = path.resolve(__dirname, path.join('..', '..'));
var BASE_DIR_NODE_MODULES = path.resolve(BASE_DIR, 'node_modules');

require.main.paths.unshift(NODE_MODULES);

var getVersions = require(RELATIVE + '/lib/getVersions');

// the following will ensure that the analytics will be only 
// performed on the last call
if( path.resolve(process.cwd(), path.join('..', '..')) == BASE_DIR ) {

	var info = {};
	var packageJSON = JSON.parse(fs.readFileSync(path.join(BASE_DIR, 'package.json'), 'utf8'));
	var npmArgv = JSON.parse(process.env.npm_config_argv);
	var deps = [];
	var devDeps = [];


	if(packageJSON.dependencies) {

		deps = deps.concat(Object.keys(packageJSON.dependencies));
	}

	if(packageJSON.devDependencies) {

		devDeps = devDeps.concat(Object.keys(packageJSON.devDependencies));
	}


	// since package.json is not updated til after this script we'll check the arguments that were used to run npm install
	// It might look something like this:
	// process.env.npm_config_argv == '{"remain":["gsap"],"cooked":["i","gsap","--save"],"original":["i","gsap","--save"]}',
		
	// a new module was installed remain contains modules being currently installed
	if(npmArgv.remain.length > 0) {

		// if this was called through npm i something --save
		if(npmArgv.original.indexOf('--save') > -1) {
			
			deps = deps.concat(npmArgv.remain);
		} else if(npmArgv.original.indexOf('--save-dev') > -1) {
			
			devDeps = devDeps.concat(npmArgv.remain);
		}
	}


	info.initAuthor = process.env.npm_config_init_author_github;
	info.time = (new Date()).toString();
	info.initiators = npmArgv.remain.slice();

	info.module = {

		name: packageJSON.name,
		version: packageJSON.version,
		description: packageJSON.description,
		license: packageJSON.license,
		author: packageJSON.author,
		keywords: packageJSON.keywords,
		repository: packageJSON.repository,
		homepage: packageJSON.homepage
	};

	getVersions(deps)
	.then(function(dependencies) {

		info.module.dependencies = dependencies;

		return getVersions(devDeps);
	})
	.then(function(devDependencies) {

		info.module.devDependencies = devDependencies;
	})
	.then(function() {

		console.log(info);
	});
}
