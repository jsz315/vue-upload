const Koa = require('koa')
const Router = require('koa-router')
const cors = require('koa-cors')
const static = require('koa-static')
const bodyparser = require('koa-bodyparser')
const path = require('path')
const app = new Koa()
const router = new Router()

init(getIPAddress(), 8899);

function init(host, port) {

	app.use(static(
		path.join(__dirname, '../static')
	))

	app.use(cors({
		origin: function (ctx) {
			return "*";
		},
		exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
		maxAge: 5
    }))
    
    app.use(bodyparser());

	app.use(router.routes(), router.allowedMethods())
	
	router.get("/abc", async (ctx, next) => {
		ctx.body = "abc";
	})

	app.listen(port, host)

	let url = `http://${getIPAddress()}:${port}`;
	console.log(url);
}


// app.use(express.static('../../static'));
// app.use(express.static('../../dist'));

//使用mock数据
// app.use('/mock', express.static('./mock'));
// mock(app);

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
	return IPAddress;
}