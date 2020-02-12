<template>
  <div class="container">
    <div class="left">
        <div class="btn" :class="{'isUpload': isUpload}" @click="toggleUpload"><i class="el-icon-s-promotion tip-ico"></i> 上传</div>
        <div class="btn" :class="{'isEdit': isEdit}" @click="toggleEdit"><i class="el-icon-s-operation tip-ico"></i> 操作</div>
        <div class="btn" @click="editPage"><i class="el-icon-s-operation tip-ico"></i> 编辑</div>
        <div class="btn" @click="listPage"><i class="el-icon-s-operation tip-ico"></i> 题库</div>
        <div class="btn" @click="rankPage"><i class="el-icon-s-operation tip-ico"></i> 榜单</div>
    </div>
    <div class="right">
        <UploadItem ref="UploadItem" />
    </div>
    <div class="page" v-show="showPage">
      <div class="mask">
        <div class="box">
          <div class="tabs">
            <div class="tab" :class="{choosed: tab==0}" @click="changeTab(0)">html</div>
            <div class="tab" :class="{choosed: tab==1}" @click="changeTab(1)">txt</div>
          </div>
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
            showPage: false,
            tab: 0
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
    },
    url(){
      return this.tab == 0 ? "/html" : "/txt";
    }
  },
  methods: {
    changeTab(n){
      this.tab = n;
      this.editPage();
    },
    toggleUpload(){
      this.$store.commit('changeIsUpload', !this.$store.state.isUpload);
    },
    toggleEdit(){
      this.$store.commit('changeIsEdit', !this.$store.state.isEdit);
    },
    editPage(){
      this.showPage= true;
      axios.get(this.url, {
          params: {v: Math.random()}
      }).then(res => {
          console.log(res.data);
          this.$refs.content.value = res.data;
      });
    },
    save(){
      axios.post(this.url, {
          params: {content: this.$refs.content.value}
      }).then(res => {
          console.log(res.data);
      });
    },
    quit(){
      this.showPage = false;
    },
    preview(){
      window.open(location.origin + this.url);
    },
    listPage(){
      this.$router.push('/list')
    },
    rankPage(){
      this.$router.push('/rank')
    }
  },

}
</script>

<style lang="less" scoped>
@import url("./index.less");
</style>
