const path = require('path');

process.env.NODE_ENV = 'production';

module.exports = {
	mode: 'production',
	entry: path.resolve(__dirname, 'src/index.js'),
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'redux-connect-vue.min.js',
		library: 'ReduxConnectVue',
		libraryTarget: 'umd'
	},
	externals: {
		vue: 'Vue'
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader'
			}
		]
	}
};
