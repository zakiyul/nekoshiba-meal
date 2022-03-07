const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
    entry: "./src/app.js",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundel.js"
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    {loader:"style-loader"},
                    {loader:"css-loader"}
                ]
            },
            {
                test: /\.(gif|png|jpe?g|svg)$/i,
                use:[
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[hash:6].[ext]',
                            outputPath: 'img/',
                            publicPath: 'img/',
                            emitFile: true,
                            esModule: false
                        }
                    }
                ]
              }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html",
            filename: "index.html"
        })
    ]
}