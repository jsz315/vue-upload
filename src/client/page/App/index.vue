<template>
  <div class="container">
    <div class="left">
        <div class="btn" @click="toggleUpload">上传</div>
        <div class="btn" @click="toggleEdit">编辑</div>
    </div>
    <div class="right">
        <UploadItem ref="UploadItem" />
    </div>
  </div>
</template>

<script>
import UploadItem from '@/client/components/UploadItem/index.vue'

export default {
  components: {
    UploadItem
  },
  methods: {
    toggleUpload(){
        // this.$refs.UploadItem.toggle();
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
