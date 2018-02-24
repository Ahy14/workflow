const path = require('path')
const chalk = require('chalk');
const webpack = require('webpack')
const ManifestPlugin = require('webpack-manifest-plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const BrowserSyncPlugin = require('browser-sync-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development'
const isStaging = process.env.NODE_ENV === 'staging'
const isProd = process.env.NODE_ENV === 'production'

const supportedBrowsers = ["last 2 versions"]

const public_dir = 'public'
const assets_dir = public_dir + '/assets'

const scripts = 'sources/scripts'
const styles = 'sources/styles'

let cssLoaders = [
    { loader: 'css-loader', options: { importLoaders: 1, minimize: (isProd || isStaging) } }
]

function trailingSlashes(string) {
    return string.trim().replace(/^\/|\/$/g, '');
}

if (isProd || isStaging) {
    cssLoaders.push( {
            loader: 'postcss-loader',
            options: {
                plugins: (loader) => [
                    require('autoprefixer')({
                        browsers: supportedBrowsers
                    })
                ]
            }
        } )
}

let config = {
    entry: {
        app: ['./' + styles + '/app.scss', './' + scripts + '/app.js']
    },
    output: {
        path: path.resolve('./' + assets_dir + '/'),
        filename: '[name].js',
        publicPath: '/' + assets_dir + '/'
    },
    devtool: 'cheap-module-eval-source-map',
    resolve: {
        alias: {
            '@css': path.resolve('./' + styles + '/'),
            '@': path.resolve('./' + scripts + '/')
        }
    },
    module: {
        rules: [
            {
                enforce: 'pre',
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'eslint-loader',
                options: {
                    failOnWarning: false,
                    failOnError: false,
                    fix: false,
                    quiet: false,
                }
            }, {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets:{
                            'env': {
                                plugins: [ 'syntax-dynamic-import' ],
                                modules: false,
                                targets: {
                                    browsers: supportedBrowsers
                                }
                            }
                        }
                    }
                }
            }, {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: cssLoaders
                })
            }, {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [ ...cssLoaders, 'sass-loader' ]
                })
            }, {
                test:/\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                use: [ 'file-loader' ]
            }, {
                test:/\.(png|jpe?g|gif|svg)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,
                            name: '[name].[ext]'
                        }
                    }, {
                        loader: 'img-loader',
                        options: {
                            enabled: (isProd || isStaging)
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new ProgressBarPlugin({
            format: '  build [:bar] ' + chalk.green.bold(':percent') + ' (:elapsed seconds)',
            clear: true
        }),
        new BrowserSyncPlugin({
            notify: false,
            host: 'localhost',
            port: 3000,
            server: { baseDir: [ './' + public_dir + '/' ] },
            files: [
                {
                    match: [
                        '**/*.html'
                    ],
                    fn: function(event, file) {
                        if (event === "change") {
                            const bs = require('browser-sync').get('bs-webpack-plugin');
                            bs.reload();
                        }
                    }
                }
            ]
        }),
        new ManifestPlugin({
            publicPath: '/' + assets_dir + '/'
        }),
        new ExtractTextPlugin({
            filename: '[name].css'
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendors',
            minChunks: Infinity
            // minChunks: function(module) {
            //     var context = module.context
            //
            //     if (typeof context !== 'string') {
            //       return false
            //     }
            //
            //     return context.indexOf('node_modules') !== -1
            // }
        })
    ]
}

if (isProd) {
    // config.plugins.push(new CleanWebpackPlugin([trailingSlashes(public_dir)], {
    //     root: path.resolve('./'),
    //     verbose: false,
    //     dry: false,
    //     beforeEmit: true
    // }))
    config.plugins.push(new UglifyJSPlugin)
    config.devtool = false
}

if (isStaging) {
    config.plugins.push(new UglifyJSPlugin({
        sourceMap: true
    }))
    config.devtool = "source-map"
}

module.exports = config
