const path = require('path');

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
        webpack: {
            mode: 'none',
            devtool: 'eval-source-map',
            module: {
                rules: [
                    {
                        test: /\.js$/,
                        exclude: [/node_modules/],
                        loader: 'babel-loader',
                    },
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
                    },
                ]
            },
            resolve: {
                alias: {
                    'intact$': path.resolve(__dirname, 'dist/intact.react.js'),
                    'kpc': 'kpc/@css'
                }
            }
        },
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