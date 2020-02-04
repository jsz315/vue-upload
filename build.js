const path = require('path');
const webpack = require('webpack');
const fs = require('fs');
const {delDir, copyDir} = require('./files');
const exec = require('child_process').exec;
const global = require('./global');

const website = global.static;
// const website = "/root/www";

// const utils = require('./utils');
// const jsDir = path.resolve("src");
// const glob = require('glob');
// const entryFiles = glob.sync(jsDir + '/*.{js,jsx}');

// console.log(process.env)
// console.log(process.argv.pop())
// console.log(process.argv)

// for (var i = 0; i < entryFiles.length; i++) {
//     var filePath = entryFiles[i];
//     console.log(filePath);
//     var filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'));
//     map[filename] = filePath;
// }
// let cmd = "npm run " + list.pop();
// console.log("开始执行命令：" + cmd);
// execCmd(cmd).then(()=>{
//     console.log("执行命令完成：" + cmd);
// })

// init()



init();

function init(){
    let list = process.argv;
    if(list.length != 3){
        console.log("缺少打包目录");
        return;
    }
    
    // let app = list.pop();
    // let env = list.pop();
    // console.log(`打包环境：${env}`);
    // console.log(`打包目录：${app}`);
  
    
    // let env = list[2];
    let app = list[2];

    delDir(path.resolve(__dirname, 'static/dist'))
    delDir(path.resolve(__dirname, 'dist/js'))
    delDir(path.resolve(__dirname, 'dist/css'))
    // fs.unlinkSync(path.resolve(__dirname, `dist/${app}.html`));

    pack();

    // glob(`**/${app}/html/*.html`, function(err, files){
    //     console.log(files);
    // })
}

function pack(){
    const webpackConfig = require('./webpack.build.js')();    
    webpack(webpackConfig, function (err, stats) {
        if (err) throw err;
        process.stdout.write(stats.toString({
            colors: true,
            modules: false,
            children: false,
            chunks: false,
            chunkModules: false
        }) + '\n\n');

        console.log('build complete.\n');
        // utils.upload();

        copyDir(path.resolve(__dirname, 'dist'), website);
        copyDir(path.resolve(__dirname, 'static'), website);

    });
}

function execCmd(cmd){
    return new Promise((resolve, reject)=>{
        exec(cmd, function (error, stdout, stderr) {
            if (error) {
                reject(error);
            }
            resolve();
        });
    })
}
