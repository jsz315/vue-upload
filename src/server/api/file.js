const Router = require('koa-router')
const router = new Router()
const sqlTooler = require('../sqlTooler');
const {readHtml, saveHtml, readTxt, saveTxt, mkdirsSync, getDirFiles, deleteFolder, deleteFile, getStaticPath} = require('../fileTooler');
const fs = require('fs')

router.get("/yun/dir", async (ctx, next) => {
  console.log("path=" + ctx.request.query.path);
      // let dir = path.join(__dirname, '../../static/upload' + ctx.request.query.path);
      let dir = getStaticPath(ctx.request.query.path);
  ctx.body = getDirFiles(dir);
})

router.post('/yun/upload', async (ctx, next) => {
  const file = ctx.request.files.file;
  let filename = file.name;
  console.log("ctx.request.body");
  console.log(ctx.request.body);
  // console.log("ctx.request.files");
  // console.log(ctx.request.files);
      // let dir = path.join(__dirname, '../../static/upload/' + ctx.request.body.path);
      let dir = getStaticPath(ctx.request.body.path);
  console.log(dir);
  mkdirsSync(dir);
  let aim = path.resolve(dir, filename);
  console.log(aim);

  const reader = fs.createReadStream(file.path);
  const upStream = fs.createWriteStream(path.resolve(dir, filename));
  reader.pipe(upStream);
  return ctx.body = '上传成功';
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

module.exports = router