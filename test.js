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

// saveHtml("ssf");
console.log(readHtml());

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
// sqlTooler.test();

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