const Router = require('koa-router')
const router = new Router()
const sqlTooler = require('../sqlTooler');
const {readHtml, saveHtml, readTxt, saveTxt, mkdirsSync, getDirFiles, deleteFolder, deleteFile, getStaticPath} = require('../fileTooler');
const fs = require('fs')
const path = require('path')

function getDir(type){
  let dir;
  if(type == 1){
    dir = getStaticPath("media/image");
  }
  else if(type == 2){
    dir = getStaticPath("media/audio");
  }
  else if(type == 3){
    dir = getStaticPath("media/video");
  }
  return dir;
}

function addMedia(file, type){
  // const file = ctx.request.files.file;
  let dir = getDir(type)

  let filename;
  if(file && dir){
    mkdirsSync(dir);
    filename = Date.now() + "." + file.name.split(".").pop();
    console.log(file.name);
    console.log(filename);
    // obj.file = filename;
    const reader = fs.createReadStream(file.path);
    const upStream = fs.createWriteStream(path.resolve(dir, filename));
    reader.pipe(upStream);
  }
  return filename;
}

router.get('/yun/question/size', async (ctx, next) => {
  let res = await sqlTooler.selectTotal();
  ctx.body = JSON.stringify(res);
});

router.get('/yun/question/all', async (ctx, next) => {
  let res = await sqlTooler.selectAll();
  ctx.body = JSON.stringify(res);
});

router.post('/yun/question/remove', async (ctx, next) => {
  let {id, type, file} = ctx.request.body;
  console.log("ctx.request.body");
  console.log(ctx.request.body);
  let res = await sqlTooler.remove(id);
  let dir = getDir(type);
  if(dir){
    fs.unlinkSync(dir + "/" + file);
    console.log('删除文件: ' + dir + "/" + file);
  }
  ctx.body = JSON.stringify(res);
});

router.post('/yun/question/update', async (ctx, next) => {
  let obj = {...ctx.request.body};
  console.log('/yun/question/update');
  console.log(obj);
  let filename = addMedia(ctx.request.files.file, obj.type);
  if(filename){
    obj.file = filename;
  }
  let res = await sqlTooler.update(obj);
  ctx.body = JSON.stringify(res);
});

router.post('/yun/question/add', async (ctx, next) => {
  console.log("ctx.request.body");
  console.log(ctx.request.body);
  let obj = {...ctx.request.body};
  let filename = addMedia(ctx.request.files.file, obj.type);
  if(filename){
    obj.file = filename;
  }
  let res = sqlTooler.add(obj);
  return ctx.body = res;
})

module.exports = router