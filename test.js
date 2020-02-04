const Koa = require('koa')
const Router = require('koa-router')
const cors = require('koa-cors')
const static = require('koa-static')
const bodyparser = require('koa-bodyparser')
const path = require('path')
const app = new Koa()
const router = new Router()
const sqlTooler = require('./src/server/sqlTooler');
const fs = require("fs")
const {delDir, getDirFiles, copyDir} = require('./files');

// saveHtml("ssf");
// console.log(readHtml());

// delDir(path.resolve(__dirname, 'dist/js'), dll)
// delDir(path.resolve(__dirname, 'dist'), "dll")

// delDir(path.resolve(__dirname, 'static/dist'));

let on = path.resolve(__dirname, 'dist')
let nn = path.resolve(__dirname, 'static/dist')
// fs.rename(on, nn, ()=>{console.log("重命名成功")});
// copy(on, nn, (e)=>{console.log(e)});

// copyDir(on, nn);

// delDir(path.resolve(__dirname, 'dist/js'))
// delDir(path.resolve(__dirname, 'dist/css'))

// delDir(path.resolve(__dirname, 'static/dist'))

// console.log(getDirFiles(path.resolve(__dirname, 'dist')))

function copy(oldName, newName, callback) {
	let newPath = path.dirname(newName);
	if(!fs.existsSync(newPath)){
		console.log("创建目录成功");
		fs.mkdirSync(newPath);
	}
	fs.copyFileSync(oldName, newName);
	// var readStream = fs.createReadStream(oldPath);
	// var writeStream = fs.createWriteStream(newPath);
	// readStream.on('error', callback);
	// writeStream.on('error', callback);
	// readStream.on('close', function () {
	// 	fs.unlink(oldPath, callback);
	// });

	// readStream.pipe(writeStream);
}

function saveHtml(str){
	var fd = fs.openSync('./static/html/index.html', 'w');
	fs.writeFileSync(fd, str);
	fs.closeSync(fd);
}

function readHtml(){
	if(fs.existsSync('./static/html/indexd.html')){
		var fd = fs.openSync('./static/html/indexd.html', 'r');
		var str = fs.readFileSync(fd, 'utf-8');
		fs.closeSync(fd);
		return str;
	}
	else{
		return "none";
	}
}

// init(getIPAddress(), 8899);
sqlTooler.test();
console.log(process.platform);

function getIPAddress() {
	const interfaces = require('os').networkInterfaces(); // 在开发环境中获取局域网中的本机iP地址
	let IPAddress = '127.0.0.1';
	for (var devName in interfaces) {
		var iface = interfaces[devName];
		for (var i = 0; i < iface.length; i++) {
			var alias = iface[i];
			if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
				IPAddress = alias.address;
			}
		}
	}
	// return IPAddress;
	return '0.0.0.0';
}