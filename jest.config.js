module.exports = {
	collectCoverage: true,
	collectCoverageFrom: [
		'**/src/**/*.js',
		'!**/src/**/*.spec.js'
	],
	coverageReporters: ['html', 'lcov', 'text', 'text-summary'],
	moduleFileExtensions: ['js'],
	testMatch: [
		'**/src/**/*.spec.js'
	],
	transform: {
		'^.+\\.js$': 'babel-jest'
	}
};
