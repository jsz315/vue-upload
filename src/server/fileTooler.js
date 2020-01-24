const fs = require("fs")
const path = require("path")
const htmlLink = path.resolve(__dirname, '../../static/html/index.html');
const txtLink = path.resolve(__dirname, '../../static/data/temp.txt');

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

module.exports = {
    saveHtml,
    readHtml,
    saveTxt,
    readTxt
}