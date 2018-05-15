const path = require('path')
const configs = require('./app/configs/')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {

    watch: true,

    target: 'electron',

    entry: './app/src/entry.js',

    output: {
        path: path.resolve(__dirname, `${configs.dest}`),
        publicPath: configs.publicPath,
        filename: 'js/[name].js'
    },

    module: {
        loaders: [{
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'file-loader',
                query: {
                    name: 'images/[name].[ext]'
                }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'template/index.html'),
            filename: './index.html',
            title: configs.title,
            hash: true,
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: true
            }
        })
    ],

    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.js'
        },
        extensions: ['.js', '.vue', '.json']
    }

}