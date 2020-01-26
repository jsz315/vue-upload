const fs = require("fs")
const path = require("path")
const htmlLink = path.resolve(__dirname, '../../static/html/index.html');
const txtLink = path.resolve(__dirname, '../../static/data/temp.txt');

const global = require('../../global');

function save(str, link){
    var fd = fs.openSync(link, 'w');
	fs.writeFileSync(fd, str);
	fs.closeSync(fd);
}

function read(link){
    if(fs.existsSync(link)){
        var fd = fs.openSync(link, 'r');
        var str = fs.readFileSync(fd, 'utf-8');
        fs.closeSync(fd);
        return str;
    }
	return "";
}

function saveHtml(str){
    save(str, htmlLink);
}

function readHtml(){
    return read(htmlLink);
}

function saveTxt(str){
    save(str, txtLink);
}

function readTxt(){
    return read(txtLink);
}

function mkdirsSync(dirname) {
    if (fs.existsSync(dirname)) {
        return true;
    } else {
        if (mkdirsSync(path.dirname(dirname))) {
            fs.mkdirSync(dirname);
            return true;
        }
    }
}

function getDirFiles(dir) {
    var results = []
    var list = fs.readdirSync(dir)
    list.forEach(function (file) {
        results.push(file)

        // file = path.join(dir, file)
        // var stat = fs.statSync(file)
        // if (stat && stat.isDirectory()) {
        //     results = results.concat(getDirFiles(file))
        // } else {
        //     results.push(file)
        // }
    })
    return results
}

//上传参数为/key
function deleteFolder(fname){
    let fpath = path.resolve(__dirname, '../../static/upload' + fname);
    delDir(fpath);
}

//上传参数为/key
function deleteFile(fname){
    fname = path.resolve(__dirname, '../../static/upload' + fname);
    fs.unlinkSync(fname);
}

function delDir(path) {
    let files = [];
    if (fs.existsSync(path)) {
        files = fs.readdirSync(path);
        files.forEach((file, index) => {
            let curPath = path + "/" + file;
            if (fs.statSync(curPath).isDirectory()) {
                delDir(curPath); //递归删除文件夹
            } else {
                fs.unlinkSync(curPath); //删除文件
            }
        });

        fs.rmdirSync(path);
    }
    console.log("删除目录" + path);
}

function getStaticPath(name){
    // let dir = path.join('/usr/local/var/www', name || "./");
    // let dir = path.join('/usr/local/var/www', name || "");
    console.log(`name=[${name}]`);
    let dir = global.static;
    if(name){
        dir = dir + "/" + name;
    }
    console.log(`dir=[${dir}]`);
    return dir;
}

module.exports = {
    saveHtml,
    readHtml,
    saveTxt,
    readTxt,
    mkdirsSync,
    getDirFiles,
    deleteFolder,
    deleteFile,
    getStaticPath
}