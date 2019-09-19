const Koa = require('koa')
const multer = require('koa-multer')
const Router = require('koa-router')
const cors = require('koa-cors')
const static = require('koa-static')
const path = require('path')
const webpack = require('webpack');
const devMiddleware = require('./devMiddleware');
const hotMiddleware = require('./hotMiddleware');
const opn = require('opn');
const app = new Koa()
const router = new Router()
const tokenTooler = require('./tokenTooler');

init(getIPAddress(), 8899);

function init(host, port) {

	const config = require('../../webpack.dev.js')();
	const compiler = webpack(config);

	app.use(devMiddleware(compiler, {
		noInfo: true,
		watchOptions: {
			ignored: /node_modules/,
		},
		publicPath: config.output.publicPath
	}));

	// app.use(hotMiddleware(compiler, {
	// 	reload: true
	// }));

	app.use(static(
		path.join(__dirname, '../../static')
	))

	app.use(cors({
		origin: function (ctx) {
			return "*";
		},
		exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
		maxAge: 5
	}))

	app.use(router.routes(), router.allowedMethods())

	const storage = multer.diskStorage({
		destination: function (req, file, cb) {
			cb(null, path.join(__dirname, '../../static/upload'))
		},
		filename: function (req, file, cb) {
			cb(null, file.originalname);
		}
	})

	var upload = multer({
		storage: storage
	});

	router.post('/upload', upload.single('file'), async (ctx, next) => {
		ctx.set('Access-Control-Allow-Origin', '*');
		ctx.body = {
			filename: ctx.req.file.filename
		}
	})

	router.get("/abc", async (ctx, next) => {
		ctx.body = "abc";
	})

	router.get("/token", async (ctx, next) => {
		var token = tokenTooler.getToken();
		console.log(token);
		ctx.body = token;
	})

	app.listen(port, host)

	let url = `http://${getIPAddress()}:${port}`;
	console.log(url);
	opn(url);
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