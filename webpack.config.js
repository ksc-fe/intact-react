module.exports = {
    mode: 'production',
    entry: {
        "index": __dirname + '/index.js'
    },
    output: {
        path: __dirname + '/dist',
        filename: "intact.js",
        library: "Intact",
        libraryTarget: "umd"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: [/node_modules/],
                loader: 'babel-loader',
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.vdt$/,
                loader: 'vdt-loader'
            }
        ]
    }
};