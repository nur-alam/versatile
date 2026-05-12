const path = require('node:path');
const fs = require('fs');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts');
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
					use: [
						MiniCssExtractPlugin.loader,
						'css-loader',
						{
							loader: 'postcss-loader',
							options: {
								postcssOptions: {
									plugins: [require('tailwindcss'), require('autoprefixer')],
								},
							},
						},
					],
				},
				{
					test: /\.scss$/i,
					use: [
						MiniCssExtractPlugin.loader,
						'css-loader',
						{
							loader: 'postcss-loader',
							options: {
								postcssOptions: {
									plugins: [require('tailwindcss'), require('autoprefixer')],
								},
							},
						},
						'sass-loader',
					],
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
		plugins: [
			new RemoveEmptyScriptsPlugin(),
			new webpack.ProvidePlugin({ React: 'react' }),
			new MiniCssExtractPlugin({
				filename: (pathData) => {
					return pathData.chunk.name.includes('style') || pathData.chunk.name.includes('quickact')
						? '../css/[name].css'
						: '[name].css';
				},
			}),
		],
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
				new CssMinimizerPlugin(),
			],
		};
	}

	const react_blueprints = [
		{
			dest_path: './assets/dist/js',
			src_files: {
				'versatile-js.min': './src/index.tsx',
				'versatile-quickact.min': './src/entries/quickact/index.tsx',
				'style.min': './assets/src/scss/index.scss',
				'quickact.min': './assets/src/scss/quickact/index.scss',
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
						"@entries": path.resolve(__dirname, './src/entries'),
					},
				},
			})
		);
	}

	return [...configEditors];
};
