<template>
  <div class="container">
    <!-- <img class="img" src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1580841529120&di=edc49dab12d1775fbf7e2005b5908166&imgtype=0&src=http%3A%2F%2Fimg0.pclady.com.cn%2Fpclady%2F2001%2F09%2F1936241_38.jpg"/> -->
    <div class="box">
      <img ref='img' class="img" :src="src" v-if="src"/>
      <canvas ref="canvas" class="canvas" v-if="edit"></canvas>
    </div>
    <div class="btns">
      <div class="btn" @click="onCancel">取消</div>
      <div class="btn sure" @click="onSure">确定</div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

import yunTooler from '@/client/js/yunTooler'

console.log('addevent');
let sx;
let sy;
let img;
let canvas;
let context;
let imgWidth;
let imgHeight;
let inPage;

let top = 0;
let right = 0;
let bottom = 0;
let left = 0;

window.addEventListener('touchstart', e => {
  // console.log('touchstart')
  // console.log(e);
  if(!inPage){
    return;
  }
  // e.preventDefault();
  sx = e.changedTouches[0].screenX;
  sy = e.changedTouches[0].screenY;
  console.log(`sx=${sx}, sy=${sy}`)

}, { passive: false })

window.addEventListener('touchmove', e => {
  // console.log('touchstart')
  if(!inPage){
    return;
  }
  e.preventDefault();
}, { passive: false });

window.addEventListener('touchend', e=>{
  // console.log('touchend')
  // console.log(e);
  if(!inPage){
    return;
  }
  // e,preventDefault();
  let ex = e.changedTouches[0].screenX;
  let ey = e.changedTouches[0].screenY;

  let dx = ex - sx;
  let dy = ey - sy;
  let space = 10;
  let percent = 0.2;


  if(dy > space){
    console.log("向下");
    if(sy < window.innerHeight / 2){
      top += dy * percent;
    }
    else{
      bottom -= dy * percent;
    }
  }
  else if(dy < -space){
    console.log("向上");
    if(sy > window.innerHeight / 2){
      bottom += Math.abs(dy) * percent;
    }
    else{
      top -= Math.abs(dy) * percent;
    }
  }

  if(dx > space){
    console.log("向右");
    if(sx < window.innerWidth / 2){
      left += dx * percent;
    }
    else{
      right -= dx * percent;
    }
  }
  else if(dx < -space){
    console.log("向左");
    if(sx > window.innerWidth / 2){
      right += Math.abs(dx) * percent;
    }
    else{
      left -= Math.abs(dx) * percent;
    }
  }

  top = sizeNum(top, 0, imgHeight / 2);
  bottom = sizeNum(bottom, 0, imgHeight / 2);
  left = sizeNum(left, 0, innerWidth / 2);
  right = sizeNum(right, 0, innerWidth / 2);
  drawRect();
}, { passive: false })

function sizeNum(num, min, max){
  if(num < min){
    return min;
  }
  if(num > max){
    return max;
  }
  return num;
}

function drawRect(){
  console.log("top, right, bottom, left");
  console.log(top, right, bottom, left);
  context.clearRect(0, 0, imgWidth, imgHeight);
  context.fillStyle = 'rgba(0, 0, 0, 0.8)';
  context.fillRect(0, 0, imgWidth, imgHeight);
  // context.globalCompositeOperation = 'destination-out';
  context.clearRect(left, top, imgWidth - left - right, imgHeight - top - bottom);
  // context.strokeStyle = "#0000ff";
  // context.strokeRect(left, top, imgWidth - left - right, imgHeight - top - bottom);
}

export default {
  data() {
        return {
          edit: true,
          src: '',
          // src: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=4061176118,3332048640&fm=11&gp=0.jpg'
        };
  },
  components: {
    
  },
  computed:{
    
  },
  mounted() {
    
  },
  beforeRouteEnter (to, from, next) {
    console.log('from =');
    console.log(from);
    console.log('to =');
    console.log(to);
    next(vm => {
      console.log("vm")
      console.log(vm)
      vm.src = vm.$route.query.src;
      console.log(vm.src);
      vm.reset();
    });
    inPage = true;
    // console.log('src');
    // this.src = this.$route.query.src;
    // console.log(this.src);
    // this.reset();
  },
  beforeRouteLeave(to, from, next){
    console.log('from ===');
    console.log(from);
    console.log('to ===');
    console.log(to);
    next();
    inPage = false;
  },
  methods: {
    reset(){
      this.edit = true;
      let img = new Image();
      img.onload = (e) => {
        console.log(img.naturalWidth);
        console.log(img.naturalHeight);
        imgWidth = img.naturalWidth;
        imgHeight = img.naturalHeight;

        canvas = this.$refs.canvas;
        canvas.width = imgWidth;
        canvas.height = imgHeight;
        context = canvas.getContext('2d');

        drawRect();
      }
      img.src = this.src;
    },
    onSure(){
      console.log('onSure');
      let w = imgWidth - left - right;
      let h = imgHeight - top - bottom;
      context.clearRect(left, top, imgWidth - left - right, imgHeight - top - bottom);

      let canvas = document.createElement('canvas');
      let scale = 750 / w;
      let cw = w * scale;
      let ch = h * scale;

      canvas.width = cw;
      canvas.height = ch;

      console.log("原始：" + w + " X " + h);
      console.log("裁剪：" + cw + " X " + ch);

      let ctx = canvas.getContext('2d');
      ctx.drawImage(this.$refs.img, left, top, w, h, 0, 0, cw, ch);
      // this.src = canvas.toDataURL("image/png");
      let urlData = canvas.toDataURL("image/jpeg", 0.8);
      // let fname = Date.now() + ".png";
      // let file = yunTooler.convertBase64UrlToImgFile(urlData, fname, "image/png");
      // console.log(file);

      // var reader = new FileReader();
      // reader.onload = () => {
      //   this.src = reader.result;
      // };
      // reader.readAsDataURL(file);
      this.src = urlData;
      this.edit = false;
      this.$store.commit('changeClipFile', urlData);
      // this.$store.commit('changeClipImage', urlData);
      history.back();
    },
    onCancel(){
      console.log('onCancel');
      // this.src = this.$route.query.src;
      // this.reset();
      this.$store.commit('changeClipFile', null);
      history.back();
    }
  },

}
</script>

<style lang="less" scoped>
@import url("./index.less");
</style>
