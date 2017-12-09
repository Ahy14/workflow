var webpack = require('webpack');
var ora = require('ora');
var conf = require('./webpack.base.js')('dev');

webpack(conf, function(error, stats){
    if(error){
        throw error
    }

    process.stdout.write(stats.toString({
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunksModules: false
    }) + '\n');
});
