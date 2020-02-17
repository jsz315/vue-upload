const Koa = require('koa')
const multer = require('koa-multer')
const Router = require('koa-router')
const cors = require('koa-cors')
const static = require('koa-static')
const bodyparser = require('koa-bodyparser')
const path = require('path')
const webpack = require('webpack');
const devMiddleware = require('./devMiddleware');
const hotMiddleware = require('./hotMiddleware');
const opn = require('opn');
const app = new Koa()
const router = new Router()
const qiniuTooler = require('./qiniuTooler');
// const sqlTooler = require('./sqlTooler');
const {readHtml, saveHtml, readTxt, saveTxt, mkdirsSync, getDirFiles, deleteFolder, deleteFile, getStaticPath} = require('./fileTooler');
const fs = require('fs')
// const formidable = require('koa-formidable');
const koaBody = require('koa-body');

const questionRouter = require('./api/question');
const dataRouter = require('./api/data');
const fileRouter = require('./api/file');
const qiniuRouter = require('./api/qiniu');
const miniRouter = require('./api/mini');
const userRouter = require('./api/user')

app.use(koaBody({
    multipart: true,
    formidable: {
        maxFileSize: 200*1024*1024    // 设置上传文件大小最大限制，默认2M
    }
}));


// const formidable = require('formidable')

function init(host, port, isDev) {
	// app.use(hotMiddleware(compiler, {
	// 	reload: true
    // }));
    
    if(isDev){
        const config = require('../../webpack.dev.js')();
        const compiler = webpack(config);

        app.use(devMiddleware(compiler, {
            noInfo: true,
            watchOptions: {
                ignored: /node_modules/,
            },
            publicPath: config.output.publicPath
        }));

        app.use(static(
            path.join(__dirname, '../../static')
        ))
    }

	// app.use(cors({
	// 	origin: function (ctx) {
	// 		return "*";
	// 	},
	// 	exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
	// 	maxAge: 5
    // }))
    
    app.use(bodyparser());

  app.use(router.routes(), router.allowedMethods())
  app.use(questionRouter.routes(), questionRouter.allowedMethods())
  app.use(dataRouter.routes(), dataRouter.allowedMethods())
  app.use(fileRouter.routes(), fileRouter.allowedMethods())
  app.use(qiniuRouter.routes(), qiniuRouter.allowedMethods())
  app.use(miniRouter.routes(), miniRouter.allowedMethods())
  app.use(userRouter.routes(), userRouter.allowedMethods())

	// const storage = multer.diskStorage({
	// 	destination: function (req, file, cb) {
	// 		var dir = path.join(__dirname, '../../static/upload');
	// 		cb(null, dir)
	// 	},
	// 	filename: function (req, file, cb) {
	// 		cb(null, file.originalname);
	// 	}
	// })

	// var upload = multer({
	// 	storage: storage
	// });

	// router.post('/upload', upload.single('file'), async (ctx, next) => {
	// 	ctx.set('Access-Control-Allow-Origin', '*');
	// 	ctx.body = {
	// 		filename: ctx.req.file.filename
	// 	}
  // })
  

	router.get("/abc", async (ctx, next) => {
		ctx.body = "abc";
  })
  
    //上传参数为全路径
    router.get("/dir", async (ctx, next) => {
        console.log(ctx.request.query.path);
        // let res = await sqlTooler.selectPath(ctx.request.query.path)
        ctx.body = JSON.stringify(0);
    })

	//上传参数为全路径
    router.get("/insert", async (ctx, next) => {
        console.log(ctx.request.query.url);
        // let res = await sqlTooler.insert(ctx.request.query.url);
        ctx.body = 0 ? "insert success" : "insert fail";
	})
	
	//上传参数为/key
    router.get("/deleteFolder", async (ctx, next) => {
        let key = ctx.request.query.url;
        // let res = await sqlTooler.deleteFolder(key);
        // qiniuTooler.deleteFolder(key);
        ctx.body = 0 ? "deleteFolder success" : "deleteFolder fail";
    })

	//上传参数为/key
    router.get("/deleteFile", async (ctx, next) => {
        let key = ctx.request.query.url;
        // let res = await sqlTooler.deleteFile(key);
        // qiniuTooler.deleteFile(key);
        ctx.body = 0 ? "deleteFile success" : "deleteFile fail";
	})
	
	


	//上传参数为文件名和/路径/
    router.post("/copyFolder", async (ctx, next) => {
        let params = ctx.request.body.params;
		console.log(params);
        // let res = await sqlTooler.copyFolder(params.names, params.srcPath, params.destPath, params.isCut);
        // qiniuTooler.copyFolder(params.names, params.srcPath, params.destPath, params.isCut);
        ctx.body = 0 ? "copyFolder success" : "copyFolder fail";
    })

	//上传参数为文件名和/路径/
    router.post("/copyFile", async (ctx, next) => {
		let params = ctx.request.body.params;
		console.log(params);
        // let res = await sqlTooler.copyFile(params.names, params.srcPath, params.destPath, params.isCut);
        // qiniuTooler.copyFile(params.names, params.srcPath, params.destPath, params.isCut);
        ctx.body = 0 ? "copyFile success" : "copyFile fail";
    })

    

	app.listen(port, host)

	let url = `http://${host}:${port}`;
	console.log(url);
	isDev && opn(url);
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

module.exports = {init};
