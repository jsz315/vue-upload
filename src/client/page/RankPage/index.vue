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
    <div class="filter">
      <div class='check-box' @click="togglerFilter()">
        <div class='check' :class="{'choose': selectFilter}"></div>
      </div>
      过滤音频
    </div>
    
    <div class="btn" @click='saveData'>保持设置</div>
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
let filterData = {
  weapp: false,
  tt: false,
  qq: false
}

export default {
  data() {
        return {
          type: 0,
          types: ['weapp', 'tt', 'qq'],
          names: ['微信', '抖音', 'QQ'],
          selectFilter: false
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
      this.showFilter();
    },
    togglerFilter(){
      this.selectFilter = !this.selectFilter;
    },
    saveData(){
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

      filterData[type] = this.selectFilter;
      console.log("修改");
      console.log(filterData);

      axios.post('/yun/data/filter', {
        content: JSON.stringify(filterData)
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
    showFilter(){
      let type = this.types[this.type];
      this.selectFilter = filterData[type];
      console.log('showFilter ' + this.type + ' == ' + type)
      console.log(filterData)
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

      axios.get('/yun/data/filter', {
        params: {
          v: Math.random()
        }
      }).then(res => {
          console.log(res.data);
          if(res.data){
            console.log("修改filter data");
            filterData = res.data;
          }
          this.showFilter();
      });

      axios.get('/yun/mini/filter', {
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
