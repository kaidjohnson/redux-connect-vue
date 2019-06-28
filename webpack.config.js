const path = require('path');

module.exports = {
	mode: 'production',
	entry: path.resolve(__dirname, 'src/index.js'),
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'redux-connect-vue.min.js',
		library: 'ReduxConnectVue',
		libraryTarget: 'umd'
	}
};
