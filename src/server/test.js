const express = require('express');
const proxy = require('express-http-proxy');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const app = express();
const opn = require('opn');
const http = require('../../config/http');
const mock = require('../../mock')


init();

function init(){
	const config = require('../../webpack.dev.js')();
	const compiler = webpack(config);
	app.use(webpackDevMiddleware(compiler, {
		publicPath: config.output.publicPath
	}));
	
	app.use(webpackHotMiddleware(compiler, {
		log: false
	}));
}

// Serve the files on port 3000.
app.listen(http.port, function () {
	let url = `http://${getIPAddress()}:${http.port}`;
	console.log(url);
	opn(url);
});

app.use(express.static('../../static'));
app.use(express.static('../../dist'));

//使用mock数据
// app.use('/mock', express.static('./mock'));
mock(app);

function getIPAddress(){
	const interfaces = require('os').networkInterfaces(); // 在开发环境中获取局域网中的本机iP地址
	let IPAddress = '127.0.0.1';
	for(var devName in interfaces){  
	  var iface = interfaces[devName];  
	  for(var i = 0; i < iface.length; i++){  
			var alias = iface[i];  
			if(alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal){  
				IPAddress = alias.address;  
			}  
	  }  
	} 
	return IPAddress;
}

/*
http://py325bkfy.bkt.clouddn.com/all.jpeg
http://py325bkfy.bkt.clouddn.com/a/pic.jpeg
http://py325bkfy.bkt.clouddn.com/a/a1/timg1.jpeg
http://py325bkfy.bkt.clouddn.com/a/a2/timg2.jpeg
http://py325bkfy.bkt.clouddn.com/a/a3/timg3.jpeg

http://py325bkfy.bkt.clouddn.com/b/a1/timg1.jpeg
http://py325bkfy.bkt.clouddn.com/b/a2/timg2.jpeg
http://py325bkfy.bkt.clouddn.com/b/a3/timg3.jpeg

http://py325bkfy.bkt.clouddn.com/c/a1/timg1.jpeg
http://py325bkfy.bkt.clouddn.com/c/a1/timg2.jpeg
http://py325bkfy.bkt.clouddn.com/c/a1/timg4.jpeg
http://py325bkfy.bkt.clouddn.com/c/a2/timg5.jpeg

http://py325bkfy.bkt.clouddn.com/
select * from table where name like '$%'
all.jpeg
/a
/b
/c

http://py325bkfy.bkt.clouddn.com/a
*/