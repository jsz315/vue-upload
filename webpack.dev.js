const merge = require("webpack-merge");
const webpack = require('webpack');
const http = require('./config/http');
const hotMiddlewareScript = 'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true'

function getConfig(){
    const baseConfig = require("./webpack.base");
    const config = merge(baseConfig, {
        // Provides process.env.NODE_ENV with value development. Enables NamedChunksPlugin and NamedModulesPlugin.
        mode: 'development',
        // 开启调试模式
        // devtool: "cheap-module-eval-source-map",
        devtool: "eval-source-map",
        plugins: [
            new webpack.DefinePlugin({
                PATH: http.dev.PATH,
                MOCK: http.dev.MOCK,
                PROXY: http.dev.PROXY
            }),
            new webpack.optimize.OccurrenceOrderPlugin(),
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NoEmitOnErrorsPlugin()
        ]
    });
    // for(let i in config.entry){
    //     config.entry[i].unshift(hotMiddlewareScript);
    // }
    return config;
}
module.exports = getConfig;