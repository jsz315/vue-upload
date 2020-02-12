const Router = require('koa-router')
const router = new Router()
const {user} = require('../sql/index');
const {readHtml, saveHtml, readTxt, saveTxt, mkdirsSync, getDirFiles, deleteFolder, deleteFile, getStaticPath} = require('../fileTooler');

router.get('/yun/user/size', async (ctx, next) => {
  let res = await user.selectTotal();
  ctx.body = JSON.stringify(res);
});

router.get('/yun/user/info', async (ctx, next) => {
  let obj = {...ctx.request.body};
  let res = await user.selectOne(obj.openid);
  ctx.body = JSON.stringify(res);
});

router.post('/yun/user/add', async (ctx, next) => {
  let obj = {...ctx.request.body};
  let res = await user.add(obj);
  ctx.body = JSON.stringify(res);
});

router.post('/yun/user/updateScore', async (ctx, next) => {
  let obj = {...ctx.request.body};
  console.log(obj);
  let res = await user.updateScore(obj);
  ctx.body = JSON.stringify(res);
});

router.post('/yun/user/updateInfo', async (ctx, next) => {
  let obj = {...ctx.request.body};
  console.log(obj);
  let res = await user.updateInfo(obj);
  ctx.body = JSON.stringify(res);
});

router.post('/yun/user/ranks', async (ctx, next) => {
  // let obj = {...ctx.request.body};
  // console.log(obj);
  let res = await user.ranks();
  ctx.body = JSON.stringify(res);
});

router.post('/yun/user/myRank', async (ctx, next) => {
  let obj = {...ctx.request.body};
  console.log(obj);
  let res = await user.myRank(obj.openid);
  ctx.body = JSON.stringify(res);
});


module.exports = router