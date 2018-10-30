module.exports = {
    mode: 'production',
    entry: {
        "index": __dirname + '/index.js'
    },
    output: {
        path: __dirname + '/dist',
        filename: "intact.react.js",
        library: "Intact",
        libraryTarget: "umd"
    },
    externals: {
        'intact/dist': {
            commonjs: 'intact/dist',
            commonjs2: 'intact/dist',
            amd: 'intact/dist',
            root: 'Intact'
        },
        'react': {
            commonjs: 'react',
            commonjs2: 'react',
            amd: 'react',
            root: 'React'
        }
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: [/node_modules/],
                loader: 'babel-loader',
            }
        ]
    }
};