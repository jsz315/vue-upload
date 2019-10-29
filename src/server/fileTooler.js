const fs = require("fs")
const path = require("path")
const link = path.resolve(__dirname, '../../static/html/index.html');

function saveHtml(str){
	var fd = fs.openSync(link, 'w');
	fs.writeFileSync(fd, str);
	fs.closeSync(fd);
}

function readHtml(){
    if(fs.existsSync(link)){
        var fd = fs.openSync(link, 'r');
        var str = fs.readFileSync(fd, 'utf-8');
        fs.closeSync(fd);
        return str;
    }
	return "";
}

module.exports = {
    saveHtml,
    readHtml
}