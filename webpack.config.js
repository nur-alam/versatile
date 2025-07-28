const path = require('node:path');
const fs = require('fs');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const webpack = require('webpack');

let version = '';

try {
	const data = fs.readFileSync('versatile-toolkit.php', 'utf8');
	version = data.match(/Version:\s*([\d.]+(?:-[a-zA-Z0-9]+)?)/i)?.[1] || '';
} catch (err) {
	console.log(err);
}

module.exports = (env, options) => {
	const mode = options.mode || 'development';

	const config = {
		mode,
		module: {
			rules: [
				{
					test: /\.css$/i,
					use: ['style-loader', 'css-loader'],
				},
				{
					test: /\.scss$/i,
					use: ['css-loader', 'sass-loader'],
				},
				{
					test: /\.(js|jsx|ts|tsx)$/,
					exclude: /node_modules/,
					use: 'babel-loader',
				},
				{
					test: /\.(png|jp(e*)g|gif|webp)$/,
					use: [
						{
							loader: 'file-loader',
							options: {
								name: 'images/[hash]-[name].[ext]',
							},
						},
					],
				},
				{
					test: /\.svg$/i,
					issuer: /\.[jt]sx?$/,
					use: ['@svgr/webpack'],
				},
			],
		},
		plugins: [new webpack.ProvidePlugin({ React: 'react' })],
		externals: {
			react: 'React',
			'react-dom': 'ReactDOM',
			'@wordpress/i18n': 'wp.i18n',
		},
		devtool: 'source-map',
	};

	if ('production' === mode) {
		config.devtool = false;
		config.optimization = {
			minimize: true,
			minimizer: [
				new TerserPlugin({
					parallel: true,
					terserOptions: {
						compress: { drop_console: true },
						output: {
							comments: false,
							ecma: 6,
						},
					},
					extractComments: false,
				}),
			],
		};
	}

	const react_blueprints = [
		{
			dest_path: './assets/dist/js',
			src_files: {
				'versatile-js.min': './src/index.tsx',
			},
		},
	];

	const configEditors = [];
	for (let i = 0; i < react_blueprints.length; i++) {
		const { src_files, dest_path } = react_blueprints[i];
		configEditors.push(
			Object.assign({}, config, {
				name: 'configEditor',
				entry: src_files,
				output: {
					path: path.resolve(dest_path),
					filename: '[name].js',
					chunkFilename: `lazy-chunks/[name].[contenthash].min.js?v=${version}`,
					clean: true,
				},
				resolve: {
					extensions: ['.js', '.jsx', '.ts', '.tsx'],
					fallback: {
						fs: false,
						path: false,
						os: false,
					},
					alias: {
						'@': path.resolve(__dirname, 'src'),
						'@components': path.resolve(__dirname, './src/components'),
						'@config': path.resolve(__dirname, './src/config'),
						'@lib': path.resolve(__dirname, './src/lib'),
						'@utils': path.resolve(__dirname, './src/utils'),
						'@hooks': path.resolve(__dirname, './src/hooks'),
						'@pages': path.resolve(__dirname, './src/pages'),
					},
				},
			})
		);
	}

	return [...configEditors];
};
