
const srcDir = 'src';
const destDir = 'build';


const path = require('path');

const srcPath = path.resolve(__dirname, srcDir);
const destPath = path.resolve(__dirname, destDir);

// Commandline arguments
// --production (or --prod) minify files
// --development (or --dev) do not minify files
const isProdEnvironment = function () {
	let isProdEnv = false;
	for (var i in process.argv) {
		if (i > 1) {
			let arg = process.argv[i].toLowerCase();
			if (arg === '--production' || arg === '--prod') {
				isProdEnv = true;
			} else if (arg === '--development' || arg === '--dev') {
				isProdEnv = false;
			}
		}
	}
	return isProdEnv;
}
let isProdEnv = isProdEnvironment();

const errorHandler = function (error) {
	console.log('Error:', error);
}

// Load plugins
const gulp = require('gulp'),
	concat = require('gulp-concat'),
	systemjsBuilder = require('gulp-systemjs-builder');

gulp.task('scripts', function () {
	var builder = new systemjsBuilder();
	builder.loadConfigSync('./system.config.js');

		
	// Main file
	builder.buildStatic(
		srcDir + '/scripts/main.ts',
		'main.js',
		{
			minify: isProdEnv,
			mangle: isProdEnv
		}
	)
		.pipe(gulp.dest(destPath))
		.on('error', errorHandler);
});

// Default task
gulp.task('default', ['scripts']);

