var webpack = require('webpack');
var ora = require('ora');
var conf = require('./webpack.base.js')('prod');
var spinner = ora('Loading ...');

spinner.start();

webpack(conf, function(error, stats){
    if(error){
        spinner.fail();
        throw error
    }

    spinner.stop();
    process.stdout.write(stats.toString({
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunksModules: false
    }) + '\n');
});
