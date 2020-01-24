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
const sqlTooler = require('./sqlTooler');
const {readHtml, saveHtml, readTxt, saveTxt, mkdirsSync, getDirFiles, deleteFolder, deleteFile} = require('./fileTooler');
const fs = require('fs')
// const formidable = require('koa-formidable');
const koaBody = require('koa-body');

app.use(koaBody({
    multipart: true,
    formidable: {
        maxFileSize: 200*1024*1024    // 设置上传文件大小最大限制，默认2M
    }
}));


// const formidable = require('formidable')

// init("127.0.0.1", 8899);

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
    }

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
    
    app.use(bodyparser());

	app.use(router.routes(), router.allowedMethods())

	const storage = multer.diskStorage({
		destination: function (req, file, cb) {
			var dir = path.join(__dirname, '../../static/upload');
			cb(null, dir)
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

	router.post('/yun/upload', async (ctx, next) => {
		const file = ctx.request.files.file;
		let filename = file.name;
		// console.log("ctx.request.body");
		// console.log(ctx.request.body);
		// console.log("ctx.request.files");
		// console.log(ctx.request.files);
		let dir = path.join(__dirname, '../../static/upload/' + ctx.request.body.path);
		console.log(dir);
		mkdirsSync(dir);
		let aim = path.resolve(dir, filename);
		console.log(aim);

		const reader = fs.createReadStream(file.path);
		const upStream = fs.createWriteStream(path.resolve(dir, filename));
		reader.pipe(upStream);
		return ctx.body = '上传成功';
	
		/*
		let form = formidable.parse(ctx.request);
		function formImage() {
			return new Promise((resolve, reject) => {
				form((opt, {fields, files})=> {
					// let path = fields.path;
					let filename = files.file.name;
					let dir = path.join(__dirname, '../../static/upload/' + fields.path);
					console.log("filename", filename);
					console.log("dir", dir);
					console.log("files.file.path", files.file.path);
					// console.log("files.upload.path", files.upload.path);
					mkdirsSync(dir);
					var readStream = fs.createReadStream(files.file.path);
					var writeStream = fs.createWriteStream(path.resolve(dir, filename));
					readStream.pipe(writeStream);
					readStream.on('end',function(){
						fs.unlinkSync(files.file.path);
					});

					// fs.renameSync(files.file.path, path.resolve(dir, filename));
					resolve(path.resolve(dir, filename));
				})
			})
		}
		let url = await formImage();
		ctx.body = {
			filename: url
		}
		*/
	})

	router.get("/abc", async (ctx, next) => {
		ctx.body = "abc";
	})

	router.get("/token", async (ctx, next) => {
		console.log(ctx.request.query);
        var token = qiniuTooler.getToken(ctx.request.query.key);
        console.log("获取token：");
		console.log(token);
		ctx.body = token;
	})

	router.get("/yun/dir", async (ctx, next) => {
		console.log(ctx.request.query.path);
		let dir = path.join(__dirname, '../../static/upload/' + ctx.request.query.path);
		ctx.body = getDirFiles(dir)
	})
	
    //上传参数为全路径
    router.get("/dir", async (ctx, next) => {
        console.log(ctx.request.query.path);
        let res = await sqlTooler.selectPath(ctx.request.query.path)
        ctx.body = JSON.stringify(res);
    })

	//上传参数为全路径
    router.get("/insert", async (ctx, next) => {
        console.log(ctx.request.query.url);
        let res = await sqlTooler.insert(ctx.request.query.url);
        ctx.body = res ? "insert success" : "insert fail";
	})
	
	//上传参数为/key
    router.get("/deleteFolder", async (ctx, next) => {
        let key = ctx.request.query.url;
        let res = await sqlTooler.deleteFolder(key);
        qiniuTooler.deleteFolder(key);
        ctx.body = res ? "deleteFolder success" : "deleteFolder fail";
    })

	//上传参数为/key
    router.get("/deleteFile", async (ctx, next) => {
        let key = ctx.request.query.url;
        let res = await sqlTooler.deleteFile(key);
        qiniuTooler.deleteFile(key);
        ctx.body = res ? "deleteFile success" : "deleteFile fail";
	})
	
	//上传参数为/key
    router.get("/yun/deleteFolder", async (ctx, next) => {
        let key = ctx.request.query.url;
        // let res = await sqlTooler.deleteFolder(key);
        deleteFolder(key);
        ctx.body = "deleteFolder success";
    })

	//上传参数为/key
    router.get("/yun/deleteFile", async (ctx, next) => {
        let key = ctx.request.query.url;
        // let res = await sqlTooler.deleteFile(key);
        deleteFile(key);
        ctx.body = "deleteFile success";
    })


	//上传参数为文件名和/路径/
    router.post("/copyFolder", async (ctx, next) => {
        let params = ctx.request.body.params;
		console.log(params);
        let res = await sqlTooler.copyFolder(params.names, params.srcPath, params.destPath, params.isCut);
        qiniuTooler.copyFolder(params.names, params.srcPath, params.destPath, params.isCut);
        ctx.body = res ? "copyFolder success" : "copyFolder fail";
    })

	//上传参数为文件名和/路径/
    router.post("/copyFile", async (ctx, next) => {
		let params = ctx.request.body.params;
		console.log(params);
        let res = await sqlTooler.copyFile(params.names, params.srcPath, params.destPath, params.isCut);
        qiniuTooler.copyFile(params.names, params.srcPath, params.destPath, params.isCut);
        ctx.body = res ? "copyFile success" : "copyFile fail";
    })

    router.get("/html", async (ctx, next) => {
        let html = readHtml();
        ctx.body = html;
    })

    router.post("/html", async (ctx, next) => {
        let params = ctx.request.body.params;
        saveHtml(params.content);
        ctx.body = "success";
	})

	router.get("/txt", async (ctx, next) => {
        let html = readTxt();
        ctx.body = html;
    })

    router.post("/txt", async (ctx, next) => {
        let params = ctx.request.body.params;
        saveTxt(params.content);
        ctx.body = "success";
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
