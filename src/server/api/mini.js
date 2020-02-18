const Router = require('koa-router')
const router = new Router()
const sqlTooler = require('../sqlTooler');
const {readHtml, saveHtml, readTxt, saveTxt, mkdirsSync, getDirFiles, deleteFolder, deleteFile, getStaticPath} = require('../fileTooler');
const fs = require('fs')
const path = require('path')
const axios = require('axios');
const config = {
  tt:{
    appid: 'tt4296342bddbc5b4e',
    secret: '548c20888fa6aa10b4d231672b7f1c08d98a761a'
  },
  weapp:{
    appid: 'wxfe6b97cf2b47c8a5',
    secret: '28006936ee716fea01701d8a689dd4cf'
  },
  qq: {
    appid: '1110260868',
    secret: 'UmeMU0xNQ0HkYxQc',
    token: ''
  }
};


router.get('/tt/login', async (ctx, next) => {
  console.log(ctx.request);
  let {code} = ctx.request.query;
  console.log('code = ' + code);
  let url = 'https://developer.toutiao.com/api/apps/jscode2session';
  let res = await axios.get(url, {
    params: {
      appid: config.tt.appid,
      secret: config.tt.secret,
      code: code
    }
  });
  console.log(res.data);
  ctx.body = JSON.stringify(res.data);
});

router.get('/weapp/login', async (ctx, next) => {
  console.log(ctx.request);
  let {code} = ctx.request.query;
  console.log('code = ' + code);
  let url = 'https://api.weixin.qq.com/sns/jscode2session';
  let res = await axios.get(url, {
    params: {
      appid: config.weapp.appid,
      secret: config.weapp.secret,
      js_code: code,
      grant_type: 'authorization_code'
    }
  });
  console.log(res.data);
  ctx.body = JSON.stringify(res.data);
});

router.get('/qq/login', async (ctx, next) => {
  console.log(ctx.request);
  let {code} = ctx.request.query;
  console.log('code = ' + code);
  let url = 'https://api.q.qq.com/sns/jscode2session';
  let res = await axios.get(url, {
    params: {
      appid: config.qq.appid,
      secret: config.qq.secret,
      js_code: code,
      grant_type: 'authorization_code'
    }
  });
  console.log(res.data);
  ctx.body = JSON.stringify(res.data);
});



module.exports = router
