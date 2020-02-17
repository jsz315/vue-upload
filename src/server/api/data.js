const Router = require('koa-router')
const router = new Router()
const sqlTooler = require('../sqlTooler');
const {readHtml, saveHtml, readTxt, saveTxt, readJson, saveJson} = require('../fileTooler');
const fs = require('fs')
const core = require('../comm/core')


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

router.get("/yun/data/share", async (ctx, next) => {
  let html = readJson();
  ctx.body = html;
})	

router.post("/yun/data/share", async (ctx, next) => {
  let params = ctx.request.body;
  saveJson(params.content);
  core.shareData = params.content;
  ctx.body = "success";
})	

router.get("/yun/mini/share", async (ctx, next) => {
  let html = core.shareData;
  ctx.body = html;
})	


module.exports = router