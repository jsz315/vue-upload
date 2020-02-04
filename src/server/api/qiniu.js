const Router = require('koa-router')
const router = new Router()
const sqlTooler = require('../sqlTooler');
const {readHtml, saveHtml, readTxt, saveTxt, mkdirsSync, getDirFiles, deleteFolder, deleteFile, getStaticPath} = require('../fileTooler');
const fs = require('fs')

router.get("/token", async (ctx, next) => {
  console.log(ctx.request.query);
      var token = qiniuTooler.getToken(ctx.request.query.key);
      console.log("获取token：");
  console.log(token);
  ctx.body = token;
})

module.exports = router