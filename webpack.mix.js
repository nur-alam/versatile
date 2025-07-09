let mix = require('laravel-mix');
const path = require('path');
const tailwind = require('laravel-mix-tailwind');

mix.webpackConfig({
	cache: false,
});

mix.setPublicPath('./assets/dist');

// mix.sass('assets/src/scss/index.scss', 'assets/dist/css/style.min.css');

mix.sass('assets/src/scss/index.scss', 'assets/dist/css/style.min.css').tailwind();
