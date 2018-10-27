const baseWebpack = require('./webpack.config');
const webpack = {
    mode: 'development',
    devtool: 'eval-source-map',
    module: baseWebpack.module,
    resolve: {
        alias: {}
    }
}
const KARMA_ENV = process.env.KARMA_ENV;
module.exports = function (config) {
    config.set({
        browsers: KARMA_ENV === 'cli' ? ['ChromeHeadless'] : undefined,
        port: 9889,
        logLevel: config.LOG_INFO,
        files: ['./test/index.js'],
        preprocessors: {
            './test/index.js': ['webpack', 'sourcemap'],
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