const Router = require('koa-router')
const router = new Router()
const {question} = require('../sql/index');
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
  let res = await question.selectTotal();
  ctx.body = JSON.stringify(res);
});

router.get('/yun/question/all', async (ctx, next) => {
  let res = await question.selectAll();
  ctx.body = JSON.stringify(res);
});

router.get('/yun/question/level', async (ctx, next) => {
  let {level} = ctx.request.query;
  console.log('/yun/question/level')
  console.log(ctx.request.query)
  let res = await question.selectLevel(level);
  ctx.body = JSON.stringify(res);
});

router.get('/yun/question/type', async (ctx, next) => {
  let {type} = ctx.request.body;
  let res = await question.selectType(type);
  ctx.body = JSON.stringify(res);
});


router.post('/yun/question/remove', async (ctx, next) => {
  let {id, type, file} = ctx.request.body;
  console.log("ctx.request.body");
  console.log(ctx.request.body);
  let res = await question.remove(id);
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
  let res = await question.update(obj);
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
  let res = question.add(obj);
  return ctx.body = res;
})

module.exports = router