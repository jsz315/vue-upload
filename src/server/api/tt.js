const Router = require('koa-router')
const router = new Router()
const sqlTooler = require('../sqlTooler');
const {readHtml, saveHtml, readTxt, saveTxt, mkdirsSync, getDirFiles, deleteFolder, deleteFile, getStaticPath} = require('../fileTooler');
const fs = require('fs')
const path = require('path')
const axios = require('axios');
const appid = 'tt65e3135efac96458';
const secret = 'd004a4ede5b8d58a7ede68b40579b8d9512b1bc9';

router.get('/tt/login', async (ctx, next) => {
  console.log(ctx.request);
  let {code} = ctx.request.query;
  console.log('code = ' + code);
  let url = 'https://developer.toutiao.com/api/apps/jscode2session';
  let res = await axios.get(url, {
    params: {
      appid,
      secret,
      code
    }
  });
  console.log(res.data);
  ctx.body = JSON.stringify(res.data);
});


module.exports = router
