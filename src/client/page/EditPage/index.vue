<template>
  <div class="container">
    <MediaView ref="mediaView" @type="changeType"></MediaView>
    <AlertView ref="alertView" @sure='onSure'></AlertView>
    <LoadingView ref='loadingView' :progress="progress"></LoadingView>

    <div class="clip-btn" @click="clip">裁剪</div>
    <div class="type-box">
      <div class="type-tip">题目类型：</div>
      <div class="type" @click="chooseType(0)" :class="{'choose': type==0}">文字</div>
      <div class="type" @click="chooseType(1)" :class="{'choose': type==1}">图片</div>
      <div class="type" @click="chooseType(2)" :class="{'choose': type==2}">音频</div>
      <div class="type" @click="chooseType(3)" :class="{'choose': type==3}">视频</div>
    </div>
    <textarea class='question' ref='question' placeholder='请输入文字'>{{question}}</textarea>
    <div class="list">
      <div class='txt-box' v-for="(item, index) in list" :key="index">
        <div class='right-box' @click="chooseRight(index+1)">
          <div class='right' :class="{'choose': right==index+1}"></div>
        </div>
        <textarea class='answer-txt' ref="txt" placeholder='请输入文字'>{{item}}</textarea>
      </div>
    </div>

    <div class="level-box">
      难度：
      <StarView :level="level" @change="chooseLevel"></StarView>
    </div>

    <div class="btn" @click="submit">提交</div>
    <div class="btn remove" @click="remove" v-if="!isAdd">删除</div>
  </div>
</template>

<script>
import axios from 'axios';
import MediaView from '@/client/components/MediaView/index.vue';
import AlertView from '@/client/components/AlertView/index.vue';
import LoadingView from '@/client/components/LoadingView/index.vue';
import StarView from '@/client/components/StarView/index.vue';
import yunTooler from '@/client/js/yunTooler'

let obj;

function isNull(str){
  return /^\s*$/.test(str);
}

export default {
  data() {
        return {
          question: '',
          right: 1,
          type: 0,
          level: 0,
          list: [],
          isAdd: true,
          progress: 0
        };
  },
  components: {
    MediaView, AlertView, StarView, LoadingView
  },
  computed:{
    
  },
  // watch: {
  //   $route (to, from) {
  //     console.log('from ' + from);
  //     console.log('to ' + to);
  //   }
  // },
  beforeRouteEnter (to, from, next) {
    console.log('from');
    console.log(from);
    console.log('to');
    console.log(to);
    next(vm => {
      if(from.path == "/clip"){
        console.log("vm");
        console.log(vm);
        if(vm.$store.state.clipFile){
          vm.$refs.mediaView.clipMedia(vm.$store.state.clipFile);
        }
      }
      else if(from.path == "/list"){
        vm.reset();
      }
    });
  },
  mounted() {
  //  this.reset();
  },
  methods: {
    reset(){
      console.log("query");
      console.log(this.$route.query);
      obj = this.$route.query.item || {};
      this.question = obj.question;
      this.list = [obj.answer1, obj.answer2, obj.answer3, obj.answer4];
      this.right = obj.right || 1;
      this.level = obj.level || 1;
      this.type = obj.type || 0;
      this.$refs.mediaView.setMedia(obj.type, obj.file);
      console.log(this.$route);
      console.log(this.$route.query.type);
      this.isAdd = this.$route.query.type == "add";
    },
    jump(n){
      console.log(n);
    },
    remove(){
      this.$refs.alertView.show("你确定要删除改题目吗？删除操作不可恢复");
      // var obj = this.$route.query;
      // yunTooler.removeQuestion(obj.id);
    },
    clip(){
      this.$router.push({
        path: '/clip',
        query: {
          src: this.$refs.mediaView.media
        },
      });
    },
    onSure(){
      var obj = this.$route.query.item.item;
      yunTooler.removeQuestion(obj);
      this.$toast('删除成功');
      history.back();
    },
    onProgress(n){
      this.progress = n;
      if(n == 100){
        setTimeout(() => {
          this.$refs.loadingView.hide();
          history.back();
        }, 300)
      }
    },
    changeType(n){
      this.type = n;
      this.$toast("类型已自动切换");
    },
    submit(){
      let {file} = this.$refs.mediaView;

      var question = this.$refs.question.value;
      console.log(file, this.type);
      console.log(this.$refs.mediaView);
      if(isNull(question)){
        this.$toast("题目不能为空");
        return;
      }

      // var obj = this.$route.query.item;
      var txts = this.$refs.txt;

      for(var i = 0; i < txts.length; i++){
        if(isNull(txts[i].value)){
          this.$toast("选项不能为空");
          return;
        }
      }

      if(this.isAdd){
        if(this.type != 0){
          if(!file){
            this.$toast("请上传对应的文件");
            return;
          }
        }

        this.$refs.loadingView.show("上传中");

        yunTooler.addQuestion(file, {
          type: this.type,
          question: question,
          answer1: txts[0].value,
          answer2: txts[1].value,
          answer3: txts[2].value,
          answer4: txts[3].value,
          right: this.right,
          level: this.level,
          // file: this.file
        }, this.onProgress)
      }
      else{
        this.$refs.loadingView.show("上传中");

        yunTooler.updateQuestion(file, {
          type: this.type,
          question: question,
          answer1: txts[0].value,
          answer2: txts[1].value,
          answer3: txts[2].value,
          answer4: txts[3].value,
          right: this.right,
          level: this.level,
          file: obj.file,
          id: obj.id
        }, this.onProgress)
      }
      
    },
    chooseRight(n){
      this.right = n;
    },
    chooseType(n){
      this.type = n;
    },
    chooseLevel(n){
      this.level = n;
    }
    
  },

}
</script>

<style lang="less" scoped>
@import url("./index.less");
</style>
