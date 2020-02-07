<template>
  <div class="container">
    <div class="nav">
      <div class="edit" @click='edit'>{{isEdit ? "完成" : "编辑"}}</div>
      题库
      <div class="add" @click='add'>添加</div>
    </div>
    <div class='list'>
      <div class="item" v-for="(item, index) in list" @click='jump(index)'>
        <div class="check" :class="{selected: item.selected}" v-show="isEdit"></div>
        <div class="info">
          <div class="word">{{index + 1}}. {{item.question}}</div>
          <div class="state">
            <span>难度：{{item.level}}</span>
            <span>{{getTime(item.time)}}</span>
            
            <!-- <StarView :level="item.level"></StarView> -->
          </div>
        </div>
        <div class="img" :class="{ico:item.type != 1}" :style="{'backgroundImage': 'url(' + getImage(item.type, item.file) + ')'}"></div>

        <!-- <img v-if="type==1" class="media" :src="media"/>
        <audio v-if="type==2" class="media" controls :src="media"></audio>
        <video v-if="type==3" class="media" controls :src="media"></video> -->
      </div>
    </div>

    <div class="fresh" @click="fresh"></div>

    <div class="footer" v-show="isEdit">
      <div class="all" @click="choose">
        <div class="check" :class="{selected: isAll}"></div>
        全选
      </div>
      <div class="delete" @click="remove">删除</div>
    </div>

  </div>
</template>

<script>
import axios from 'axios';
import yunTooler from '@/client/js/yunTooler'
import StarView from '@/client/components/StarView/index.vue';

function addZero(n){
  if(n > 9){
    return n;
  }
  return '0' + n;
}

export default {
  data() {
        return {
            list: [],
            isEdit: false,
            isAll: false
        };
  },
  components: {
    StarView
  },
  computed:{
    
  },
  mounted() {
    this.init();
  },
  methods: {
    getImage(type, file){
      if(type == 1){
        return yunTooler.getTypeFile(type, file);
      }
      if(type == 0){
        return '/asset/img/txt.png';
      }
      else if(type == 2){
        return '/asset/img/audio.png';
      }
      else if(type == 3){
        return '/asset/img/video.png';
      }
    },
    getTime(n){
      var t = new Date(n);
      var m = t.getMonth() + 1;
      var d = t.getDate();
      var H = t.getHours();
      var M = t.getMinutes();
      // var S = t.getSeconds();
      return `${addZero(m)}-${addZero(d)} ${addZero(H)}:${addZero(M)}`;
    },
    fresh(){
      this.init();
    },
    init(){
      axios.get('/yun/question/all', {
          params: {v: Math.random()}
      }).then(res => {
          console.log(res.data);
          let list = res.data;
          list.forEach(item => {
            item.selected = false;
          });
          this.list = list;
      });
    },
    jump(n){
      console.log(n);
      console.log(this.list[n]);
      if(this.isEdit){
        this.list[n].selected = !this.list[n].selected;
      }
      else{
        this.$router.push({
          path: '/edit',
          query: {
            item: this.list[n],
            type: 'update'
          },
        });
      }
    },
    add(){
      this.$router.push({
        path: '/edit',
        query: {
          type: 'add'
        },
      });
    },
    edit(){
      this.isEdit = !this.isEdit;
    },
    choose(){
      this.isAll = !this.isAll;
      this.list.forEach(item => {
        item.selected = this.isAll;
      });
    },
    remove(){
      this.list.forEach(item => {
        if(item.selected){
          yunTooler.removeQuestion(item);
        }
      });
      this.isEdit = false;
      setTimeout(() => {
        this.init();
      }, 300);
    }
    
  },

}
</script>

<style lang="less" scoped>
@import url("./index.less");
</style>
