import path from 'path';

module.exports = {
	target: 'web',
    entry: {
        libraries: './src/index.ts'
    },
    output: {
        path:          path.join(__dirname, 'mouse-battery.widget', 'lib'),
        filename:      'libraries.bundle.js',
        library:       'Libraries',
        libraryTarget: 'umd'
    },
	resolve: {
		extensions: ['.ts', '.js'],
	},
	module: {
		rules: [{
			test:    /\.ts$/,
			use: [{
				loader: 'ts-loader',
			}]
		}]
	},
};
