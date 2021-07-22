module.exports = {
    mode: 'production',
    output: {
        path: __dirname + "/public",
        publicPath: "/assets/",
        filename: "bundle.js",
        chunkFilename: '[name].js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
            },
        ],
    },
}