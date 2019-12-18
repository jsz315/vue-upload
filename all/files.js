const fs = require('fs');
const glob = require('glob');
const path = require('path');

function delDir(path){
    let files = [];
    if(fs.existsSync(path)){
        files = fs.readdirSync(path);
        files.forEach((file, index) => {
            let curPath = path + "/" + file;
            if(fs.statSync(curPath).isDirectory()){
                delDir(curPath); //递归删除文件夹
            } else {
                fs.unlinkSync(curPath); //删除文件
            }
        });

        fs.rmdirSync(path);
    }
    console.log("删除目录" + path);
}

function getDirFiles(dir){
    var results = []
    var list = fs.readdirSync(dir)
    list.forEach(function(file) {
        file = path.join(dir, file)
        var stat = fs.statSync(file)
        if (stat && stat.isDirectory()){
            results = results.concat(getDirFiles(file))
        }
        else{
            results.push(file)
        }
    })
    return results
}

function copyDir(oldPath, newPath){
    let files = getDirFiles(oldPath);
    files.forEach(item => {
        let nn = item.replace(oldPath, newPath);
        copyFile(item, nn);
    })
}

function copyFile(oldName, newName) {
	let newPath = path.dirname(newName);
	if(!fs.existsSync(newPath)){
		console.log("创建目录成功");
		fs.mkdirSync(newPath);
	}
    fs.copyFileSync(oldName, newName);
    console.log(oldName, newName);
}

module.exports = {
    delDir,
    copyDir,
    getDirFiles
};