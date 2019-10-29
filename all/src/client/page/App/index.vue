<template>
  <div class="container">
    <div class="left">
        <div class="btn" :class="{'isUpload': isUpload}" @click="toggleUpload"><i class="upload ico"></i> 上传</div>
        <div class="btn" :class="{'isEdit': isEdit}" @click="toggleEdit"><i class="edit ico"></i> 操作</div>
    </div>
    <div class="right">
        <UploadItem ref="UploadItem" />
    </div>
  </div>
</template>

<script>
import UploadItem from '@/client/components/UploadItem/index.vue';


export default {
  data() {
        return {
            open: false
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
    }
  },

}
</script>

<style lang="less" scoped>
@import url("./index.less");
</style>
