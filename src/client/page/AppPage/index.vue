<template>
  <div>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
  import axios from 'axios';
  import UploadItem from '@/client/components/UploadItem/index.vue';
  
  
  export default {
  }
</script>