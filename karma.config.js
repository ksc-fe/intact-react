const path = require('path');
const baseWebpack = require('./webpack.config.js');
baseWebpack.module.rules = baseWebpack.module.rules.concat([
    {
        test: /\.css$/,
        use: [
            {
                loader: 'style-loader',
            },
            {
                loader: 'css-loader',
                options: {
                    url: true
                }
            }
        ]
    },
    {
        test: /\.(woff2?|eot|ttf|otf|svg)(\?.*)?$/,
        loader: 'file-loader'
    }
])
const webpack = {
    mode: 'development',
    module: baseWebpack.module,
    // devtool: '#inline-source-map',
    resolve: {
        alias: {
            'intact$': path.resolve(__dirname, 'index.js'),
            'kpc': 'kpc/@css'
        }
    }
}
const KARMA_ENV = process.env.KARMA_ENV;
module.exports = function (config) {
    config.set({
        browsers: KARMA_ENV === 'cli' ? ['ChromeHeadless'] : undefined,
        port: 9889,
        logLevel: config.LOG_INFO,
        files: [
            {pattern: 'test/*.js', watched: true}
        ],
        preprocessors: {
            './test/*.js': ['webpack'],
        },
        webpack: webpack,
        frameworks: [
            'mocha',
            'sinon-chai',
        ],
        plugins: [
            'karma-mocha',
            'karma-webpack',
            'karma-sourcemap-loader',
            'karma-sinon-chai',

            //无壳浏览器
            'karma-chrome-launcher'
        ],
        client: {
            mocha: {
                reporter: 'html'
            }
        },
        singleRun: true,
        reporters: ['progress'],
    });
}
