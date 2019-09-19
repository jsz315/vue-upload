const path = require('path')
const fs = require('fs')
const HtmlWebpackPlugin = require('html-webpack-plugin')
var hotMiddlewareScript = 'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true'

const walk = function(dir) {
    var results = []
    var list = fs.readdirSync(dir)
    list.forEach(function(file) {
        file = path.join(dir, file)
        var stat = fs.statSync(file)
        if (stat && stat.isDirectory()){
            results = results.concat(walk(file))
        }
        else{
            results.push(file)
        }
    })
    return results
}

const getApps = function(app){
    const list = walk(path.join(__dirname, 'src'))
    
    const r = new RegExp("src(\\\\|/).*" + app)
    let aim = []
    list.forEach(item => {
        var match = r.exec(item);
        if(match){
            if(aim.indexOf(match[0]) == -1){
                aim.push(match[0])
            }
        }
    })

    if(aim.length == 0){
        throw new Error("没有找到项目")
    }
    
    aim = aim.map(item => {
        return "./" + item.replace(/\\/g,"/")
    })
    return aim
}

const getEntry = function(apps){
    var obj = {};
    apps.forEach(item => {
        var key = item.split("/").pop()
        obj[key] = [item + "/index.js"];
        if(isDev){
            obj[key].unshift(hotMiddlewareScript);
        }
    })
    return obj
}

const getHtml = function(apps){
    return apps.map(item => {
        var key = item.split("/").pop()
        return new HtmlWebpackPlugin({
            filename: `${key}.html`,
            template: item + `/index.html`
        })
    })
}

const getCopy = function(apps){
    return apps.map(item => {
        return {
            from: path.resolve(__dirname, item + "/asset"),
            to: path.resolve(__dirname, 'dist/asset'),
            ignore: ['.*']
        }
    })
}

const isDev = process.argv[process.argv.length - 2] == 'serve'
const apps = getApps(process.argv[process.argv.length - 1])

const global = {
    entry: getEntry(apps),
    html: getHtml(apps),
    copy: getCopy(apps)
}

module.exports = global