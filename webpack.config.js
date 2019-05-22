const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const BrowserSync = require('browser-sync');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const is_prod = process.env.NODE_ENV === 'production';

const scripts_directory = './assets/scripts/';
const styles_directory = './assets/styles/';
const images_directory = './assets/images/';
const fonts_directory = './assets/fonts/';

const public_directory = './public/';
const dist_directory = 'dist';

const alias = {
    '@css': path.resolve(styles_directory),
    '@images': path.resolve(images_directory),
    '@': path.resolve(scripts_directory)
};

const modulesList = ['/node_modules/', '/bower_components/'];

const optimizers = [];

if (is_prod) {
    optimizers.push(new TerserPlugin());
    optimizers.push(new OptimizeCSSAssetsPlugin());
}

module.exports = {
    entry: {
        vendor: [styles_directory + 'main.scss'],
        app: scripts_directory + 'main.js'
    },
    output: {
        path: path.resolve(__dirname, public_directory + dist_directory),
        filename: '[name].js',
        publicPath: '/'
    },
    stats: {
        warnings: false
    },
    devtool: !is_prod ? 'cheap-module-eval-source-map' : 'nosources-source-map',
    resolve: {
        alias: alias
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].css'
                        }
                    },
                    {
                        loader: 'extract-loader'
                    },
                    {
                        loader: 'css-loader',
                        options: { url: false }
                    },
                    {
                        loader: 'sass-loader'
                    }
                ]
            }
        ]
    },
    plugins: [
        new BrowserSyncPlugin({
            host: 'localhost', // browse to http://localhost:3000/ during development,
            port: 3000,
            notify: false,
            server: { baseDir: [public_directory] }, // ./public directory is being served
            // proxy: {
            //     target: "http://127.0.0.1:8080/your/proxied/website/",
            // },
            files: [
                {
                    match: [
                        '**/*.html'
                    ],
                    fn: function (event, file) {
                        if (event === "change") {
                            const bs = BrowserSync.get('bs-webpack-plugin');
                            bs.reload();
                        }
                    }
                }
            ]
        }),
        new ProgressBarPlugin(),
        new CleanWebpackPlugin({dry: !is_prod}),
        new CopyWebpackPlugin([
            {
                from: images_directory,
                to: 'images/'
            },
            {
                from: fonts_directory,
                to: 'fonts/'
            }]),
        new ImageminPlugin({
            disable: !is_prod, // Disable during development
            pngquant: {
                quality: '95-100'
            }
        }),
        new ManifestPlugin({
            publicPath: dist_directory + '/'
        }),
        new WebpackNotifierPlugin({excludeWarnings: true})
    ],
    optimization: {
        minimizer: optimizers,
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: new RegExp(
                        `(${modulesList.join("|")})`
                    ),
                    chunks: 'initial',
                    name: 'vendor',
                    enforce: true
                }
            }
        }
    }
};
