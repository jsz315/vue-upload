<template>
  <div class="container">
    <div class="left">
        <div class="btn" :class="{'isUpload': isUpload}" @click="toggleUpload"><i class="el-icon-s-promotion"></i> 上传</div>
        <div class="btn" :class="{'isEdit': isEdit}" @click="toggleEdit"><i class="el-icon-s-operation"></i> 操作</div>
        <div class="btn" :class="{'isEdit': isEdit}" @click="editPage"><i class="el-icon-s-operation"></i> 编辑</div>
    </div>
    <div class="right">
        <UploadItem ref="UploadItem" />
    </div>
    <div class="page" v-show="showPage">
      <div class="mask">
        <div class="box">
          <textarea class="html-content" ref="content"></textarea>
          <div class="btns">
            <div class="html-btn" @click="save">保存</div>
            <div class="html-btn" @click="quit">取消</div>
            <div class="html-btn" @click="preview">预览</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import UploadItem from '@/client/components/UploadItem/index.vue';


export default {
  data() {
        return {
            open: false,
            showPage: false
        };
  },
  components: {
    UploadItem
  },
  computed:{
    isUpload(){
      return this.$store.state.isUpload;
    },
    isEdit(){
      return this.$store.state.isEdit;
    }
  },
  methods: {
    toggleUpload(){
      this.$store.commit('changeIsUpload', !this.$store.state.isUpload);
    },
    toggleEdit(){
      this.$store.commit('changeIsEdit', !this.$store.state.isEdit);
    },
    editPage(){
      this.showPage= true;
      axios.get("/html", {
          params: {v: Math.random()}
      }).then(res => {
          console.log(res.data);
          this.$refs.content.value = res.data;
      });
    },
    save(){
      axios.post("/html", {
          params: {content: this.$refs.content.value}
      }).then(res => {
          console.log(res.data);
      });
    },
    quit(){
      this.showPage = false;
    },
    preview(){
      window.open(location.origin + "/html");
    }
  },

}
</script>

<style lang="less" scoped>
@import url("./index.less");
</style>
