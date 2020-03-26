const Router = require('koa-router')
const router = new Router()
const sqlTooler = require('../sqlTooler');
const {readHtml, saveHtml, readTxt, saveTxt, readShare, saveShare, readFilter, saveFilter} = require('../fileTooler');
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
  let html = readShare();
  ctx.body = html;
})	

router.post("/yun/data/share", async (ctx, next) => {
  let params = ctx.request.body;
  saveShare(params.content);
  core.shareData = params.content;
  ctx.body = "success";
})	

router.get("/yun/data/filter", async (ctx, next) => {
  let html = readFilter();
  ctx.body = html;
})	

router.post("/yun/data/filter", async (ctx, next) => {
  let params = ctx.request.body;
  saveFilter(params.content);
  core.filterData = params.content;
  ctx.body = "success";
})	

router.get("/yun/mini/share", async (ctx, next) => {
  let html = core.shareData;
  ctx.body = html;
})	

router.get("/yun/mini/filter", async (ctx, next) => {
  let html = core.filterData;
  ctx.body = html;
})	


module.exports = router