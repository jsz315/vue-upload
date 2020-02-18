<template>
  <div class="container">
    <input ref="password" class="txt"/>
    <div class="btn all" @click='deleteRanks'>删除数据</div>
    <input ref="openid" class="txt"/>
    <div class="btn" @click='deleteUser'>删除用户</div>

    <div class="navs">
      <div class="nav" v-for="(item, index) in types" :class="{choose: type == index}" @click="choose(index)">{{names[index]}}</div>
    </div>
    <div class="share">
      <div class="label">标题</div>
      <textarea class="word" ref="title"></textarea>
      <div class="label" >描述</div>
      <textarea class="word" ref="desc"></textarea>
      <div class="label">图片地址</div>
      <textarea class="word" ref="imageUrl"></textarea>
    </div>
    <div class="btn" @click='setShare'>设置分享</div>
  </div>
</template>

<script>
import axios from 'axios';
import yunTooler from '@/client/js/yunTooler'
import StarView from '@/client/components/StarView/index.vue';

let shareData = {
              weapp: {

              },
              tt: {

              },
              qq: {

              }
            }

export default {
  data() {
        return {
          type: 0,
          types: ['weapp', 'tt', 'qq'],
          names: ['微信', '抖音', 'QQ']
        };
  },
  components: {
    
  },
  computed:{
    
  },
  mounted() {
    this.init();
  },
  methods: {
    choose(n){
      this.type = n;
      this.showShare();
    },
    setShare(){
      let param = {
        title: this.$refs.title.value,
        desc: this.$refs.desc.value,
        imageUrl: this.$refs.imageUrl.value,
      }
      console.log(param);
      let type = this.types[this.type];
      shareData[type] = param;

      axios.post('/yun/data/share', {
        content: JSON.stringify(shareData)
      }).then(res => {
        console.log(res.data);
      });
    },
    deleteRanks(){
      axios.post('/yun/user/removeAll', {
          password: this.$refs.password.value
      }).then(res => {
          console.log(res.data);
      });
    },
    deleteUser(){
      axios.post('/yun/user/remove', {
          password: this.$refs.password.value,
          openid: this.$refs.openid.value
      }).then(res => {
          console.log(res.data);
      });
    },
    showShare(){
      let type = this.types[this.type];
      let obj = shareData[type];
      this.$refs.title.value = obj.title;
      this.$refs.desc.value = obj.desc;
      this.$refs.imageUrl.value = obj.imageUrl;
    },
    init(){
      axios.get('/yun/data/share', {
        params: {
          v: Math.random()
        }
      }).then(res => {
          console.log(res.data);
          if(res.data && res.data.weapp){
            shareData = res.data;
            // let obj = this.type == 0 ? shareData['weapp'] : shareData['tt']
            // this.$refs.title.value = obj.title;
            // this.$refs.desc.value = obj.desc;
            // this.$refs.imageUrl.value = obj.imageUrl;
          }
          this.showShare();
      });

      axios.get('/yun/mini/share', {
        params: {
          v: Math.random()
        }
      }).then(res => {
          console.log(res.data);
      });

      axios.post('/yun/user/ranks', {
          openid: "jgjhkjjlkl"
      }).then(res => {
          console.log(res.data);
          if(res.data[0]){
            console.log('rank = ' + res.data[0].rownumber);
          }
          else{
            console.log('no your rank');
          }
      });
      
      axios.post('/yun/user/myRank', {
          openid: "jgjhkjjkl"
      }).then(res => {
          console.log(res.data);
          if(res.data[0]){
            console.log('rank = ' + res.data[0].rownumber);
          }
          else{
            console.log('no your rank');
          }
          
      });
    
    },

  },

}
</script>

<style lang="less" scoped>
@import url("./index.less");
</style>
