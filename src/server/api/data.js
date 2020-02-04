const Router = require('koa-router')
const router = new Router()
const sqlTooler = require('../sqlTooler');
const {readHtml, saveHtml, readTxt, saveTxt, mkdirsSync, getDirFiles, deleteFolder, deleteFile, getStaticPath} = require('../fileTooler');
const fs = require('fs')

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

module.exports = router