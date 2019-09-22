<template>
  <div class="container">
    <div class="left">
        <div class="btn">上传</div>
        <div class="btn">浏览</div>
    </div>
    <div class="right">
        <UploadItem />
        <FileView />
    </div>
  </div>
</template>

<script>
import UploadItem from '@/client/components/UploadItem/index.vue'
import FileView from '@/client/components/FileView/index.vue'

export default {
  components: {
    UploadItem, FileView
  }
}
</script>

<style lang="less" scoped>
@import url("./index.less");
</style>
