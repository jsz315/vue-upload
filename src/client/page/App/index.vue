<template>
  <div class="container">
    <div class="left">
        <div class="btn" @click="toggle">上传</div>
        <div class="btn">浏览</div>
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
    toggle(){
        this.$refs.UploadItem.toggle();
    }
  },

}
</script>

<style lang="less" scoped>
@import url("./index.less");
</style>
