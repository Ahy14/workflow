const path = require('path')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

let config = function(env){
    let cssLoaders = [
        {loader: 'css-loader', options: {importLoaders:1, minimize: env == 'prod'}}
    ];

    if(env == 'prod'){
        cssLoaders.push({
            loader: 'postcss-loader',
            options: {
                plugins: (loader) => [
                    require('autoprefixer')({
                        browsers: ['last 2 versions', 'ie > 8']
                    })
                ]
            }
        })
    }

    let conf = {
        entry:{
            app: ['./src/styles/app.scss', './src/scripts/app.js']
        },
        output:{
            path:path.resolve('./dist'),
            filename: '[name].js',
            publicPath: "./"
        },
        resolve: {
            alias: {
                '@css': path.resolve('./src/styles'),
                '@': path.resolve('./src/scripts')
            }
        },
        watch: env == 'dev',
        devtool: env == 'prod' ? "cheap-module-eval-source-map" : "source-map",
        module:{
            rules:[
                {
                    test:/\.js$/,
                    exclude: /(node_modules|bower_components)/,
                    use: ['babel-loader']
                },
                {
                    test:/\.css$/,
                    use: ExtractTextPlugin.extract({
                        use: cssLoaders
                    })
                },
                {
                    test:/\.scss$/,
                    use: ExtractTextPlugin.extract({
                        use: [...cssLoaders, 'sass-loader']
                    })
                },
                {
                    test:/\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                    use: ['file-loader']
                },
                {
                    test:/\.(png|jpe?g|gif|svg)$/,
                    use: [
                        {
                            loader: 'url-loader',
                            options: {
                                limit: 8192,
                                name: '[name].[ext]'
                            }
                        },
                        {
                            loader: 'img-loader',
                            options:{
                                enabled: env == 'prod'
                            }
                        }
                    ]
                }
            ]
        },
        plugins:[
            new ExtractTextPlugin({
                filename: '[name].css',
                disable: false
            })
        ]
    }

    if(env == 'prod'){
        conf.plugins.push(new UglifyJSPlugin({
            sourceMap: false
        }))
    }

    return conf;
}

module.exports = config;
